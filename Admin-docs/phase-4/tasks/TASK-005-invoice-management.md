# TASK-005: Gestion des Factures

**Type**: Backend Development  
**Priorité**: 🟡 Haute  
**Estimation**: 1 jour  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 2  
**Dépend de**: TASK-001, TASK-003  

## Description

Implémenter la gestion des factures Stripe : récupération, stockage des références, téléchargement de PDF et historique des paiements. Intégration dans le détail utilisateur.

## Contexte

- Les factures sont générées par Stripe
- Besoin de stocker les références localement
- Intégration avec l'historique de paiement

## Critères d'acceptation

- [ ] Table invoices pour stocker les références
- [ ] Service de récupération des factures Stripe
- [ ] Endpoint de listing avec filtres
- [ ] Téléchargement de PDF sécurisé
- [ ] Intégration dans le détail utilisateur
- [ ] Gestion des remboursements

## Tâches techniques

### 1. Migration pour la table invoices
```typescript
// migration: CreateInvoicesTable
export class CreateInvoicesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'stripe_invoice_id',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'subscription_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'number',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
          },
          {
            name: 'amount_total',
            type: 'int',
            comment: 'Amount in cents',
          },
          {
            name: 'amount_paid',
            type: 'int',
            default: 0,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'eur'",
          },
          {
            name: 'invoice_pdf',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'hosted_invoice_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'period_start',
            type: 'date',
          },
          {
            name: 'period_end',
            type: 'date',
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['subscription_id'],
            referencedTableName: 'subscriptions',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'idx_user_invoices',
            columnNames: ['user_id', 'created_at'],
          },
          {
            name: 'idx_subscription_invoices',
            columnNames: ['subscription_id'],
          },
          {
            name: 'idx_status',
            columnNames: ['status'],
          },
        ],
      }),
    );
  }
}
```

### 2. Service de gestion des factures
```typescript
// invoice.service.ts
@Injectable()
export class InvoiceService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    private auditService: AuditService,
  ) {}

  async syncInvoiceFromStripe(stripeInvoiceId: string): Promise<Invoice> {
    // Récupérer la facture depuis Stripe
    const stripeInvoice = await this.stripeService.retrieveInvoice(stripeInvoiceId);
    
    // Vérifier si elle existe déjà
    let invoice = await this.invoiceRepo.findOne({
      where: { stripe_invoice_id: stripeInvoiceId },
    });

    if (!invoice) {
      invoice = this.invoiceRepo.create();
    }

    // Mapper les données
    invoice.stripe_invoice_id = stripeInvoice.id;
    invoice.subscription_id = await this.findSubscriptionId(stripeInvoice.subscription);
    invoice.user_id = await this.findUserId(stripeInvoice.customer);
    invoice.number = stripeInvoice.number;
    invoice.status = this.mapInvoiceStatus(stripeInvoice.status);
    invoice.amount_total = stripeInvoice.amount_total;
    invoice.amount_paid = stripeInvoice.amount_paid;
    invoice.currency = stripeInvoice.currency;
    invoice.invoice_pdf = stripeInvoice.invoice_pdf;
    invoice.hosted_invoice_url = stripeInvoice.hosted_invoice_url;
    invoice.period_start = new Date(stripeInvoice.period_start * 1000);
    invoice.period_end = new Date(stripeInvoice.period_end * 1000);
    
    if (stripeInvoice.status_transitions?.paid_at) {
      invoice.paid_at = new Date(stripeInvoice.status_transitions.paid_at * 1000);
    }

    // Stocker les metadata (items, discounts, etc.)
    invoice.metadata = {
      lines: stripeInvoice.lines.data,
      discount: stripeInvoice.discount,
      tax: stripeInvoice.tax,
    };

    return await this.invoiceRepo.save(invoice);
  }

  async listInvoices(filters: ListInvoicesDto): Promise<PaginatedResult<Invoice>> {
    const { page = 1, limit = 20, userId, status, dateFrom, dateTo } = filters;

    const queryBuilder = this.invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.user', 'user')
      .leftJoinAndSelect('invoice.subscription', 'subscription');

    if (userId) {
      queryBuilder.andWhere('invoice.user_id = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (dateFrom || dateTo) {
      queryBuilder.andWhere('invoice.created_at BETWEEN :dateFrom AND :dateTo', {
        dateFrom: dateFrom || new Date('2020-01-01'),
        dateTo: dateTo || new Date(),
      });
    }

    const [invoices, total] = await queryBuilder
      .orderBy('invoice.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: invoices,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async downloadInvoicePdf(invoiceId: string, adminId: string): Promise<Buffer> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Audit
    await this.auditService.log({
      user_id: adminId,
      action: 'invoice.downloaded',
      entity_type: 'invoice',
      entity_id: invoiceId,
      metadata: { invoice_number: invoice.number },
    });

    // Récupérer le PDF depuis Stripe
    if (invoice.invoice_pdf) {
      const response = await axios.get(invoice.invoice_pdf, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    }

    throw new BadRequestException('PDF not available for this invoice');
  }
}
```

### 3. Controller Admin
```typescript
// admin-invoices.controller.ts
@Controller('admin/invoices')
export class AdminInvoicesController {
  constructor(private invoiceService: InvoiceService) {}

  @Get()
  async listInvoices(@Query() query: ListInvoicesDto) {
    return this.invoiceService.listInvoices(query);
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string) {
    const invoice = await this.invoiceService.findOne(id);
    
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  @Get(':id/download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="invoice.pdf"')
  async downloadInvoice(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<StreamableFile> {
    const adminId = req.user.id;
    const buffer = await this.invoiceService.downloadInvoicePdf(id, adminId);
    
    return new StreamableFile(buffer);
  }

  @Post('sync')
  async syncInvoices(@Body() dto: SyncInvoicesDto) {
    const { userId, fromDate } = dto;
    
    // Récupérer toutes les factures depuis Stripe
    const invoices = await this.invoiceService.syncUserInvoices(
      userId,
      fromDate
    );

    return {
      success: true,
      synced: invoices.length,
      invoices,
    };
  }
}
```

### 4. Intégration dans UserDetail
```typescript
// Ajouter dans AdminUsersService.getPaymentInfo()
private async getPaymentInfo(user: User): Promise<any> {
  const subscription = user.subscription;
  
  // Récupérer les factures récentes
  const recentInvoices = await this.invoiceService.listInvoices({
    userId: user.id,
    limit: 5,
  });

  return {
    stripe_customer_id: subscription?.stripe_customer_id || null,
    payment_methods: [], // À implémenter
    total_spent: await this.calculateTotalSpent(user),
    recent_invoices: recentInvoices.data.map(inv => ({
      id: inv.id,
      number: inv.number,
      amount: inv.amount_total / 100, // Convertir en euros
      status: inv.status,
      date: inv.created_at,
      pdf_url: `/admin/invoices/${inv.id}/download`,
    })),
    total_extra_credits_purchased: {
      // ... existant
    },
  };
}
```

### 5. DTOs
```typescript
// dto/list-invoices.dto.ts
export class ListInvoicesDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

## Dépendances

- **TASK-001** : StripeService requis
- **TASK-003** : Subscriptions pour les relations

## Risques

- **Volume de données** : Pagination obligatoire
- **PDFs volumineux** : Streaming recommandé
- **Synchronisation** : Éviter les doublons

## Définition de "Done"

- [ ] Migration exécutée
- [ ] Service de factures complet
- [ ] Endpoints fonctionnels
- [ ] Documentation API
- [ ] Intégration dans UserDetail

## Notes

- Les montants sont en centimes dans Stripe
- Toujours auditer les téléchargements de PDF
- Prévoir un cache pour les PDFs fréquemment consultés
- Gérer les remboursements dans une phase ultérieure 