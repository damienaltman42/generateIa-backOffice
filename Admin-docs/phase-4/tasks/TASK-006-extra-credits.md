# TASK-006: Crédits Supplémentaires via Stripe

**Type**: Backend Development  
**Priorité**: 🟢 Moyenne  
**Estimation**: 0.5 jour  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 2  
**Dépend de**: TASK-001, TASK-002, TASK-003  

## Description

Intégrer l'achat de crédits supplémentaires avec Stripe Invoice Items. Synchroniser avec le système existant `extra_*_purchased` et confirmer uniquement après paiement réussi.

## Contexte

- Les crédits sont stockés dans `subscription.extra_*_purchased`
- Prix unitaire : 3€ par crédit (tous types)
- ConsumptionService les prend déjà en compte
- Besoin de facturation via Stripe

## Critères d'acceptation

- [ ] Endpoint pour ajouter des crédits via Stripe
- [ ] Utilisation de Stripe Invoice Items
- [ ] Confirmation après paiement uniquement
- [ ] Synchronisation avec extra_*_purchased
- [ ] Gestion des échecs de paiement
- [ ] Audit des achats de crédits

## Tâches techniques

### 1. Extension du SubscriptionService
```typescript
// subscription.service.ts - Ajouter cette méthode
async addCredits(
  subscriptionId: string,
  dto: AddCreditsDto,
  adminId: string
): Promise<CreditPurchaseResult> {
  const subscription = await this.subRepo.findOne({
    where: { id: subscriptionId },
    relations: ['user', 'plan'],
  });

  if (!subscription) {
    throw new NotFoundException('Subscription not found');
  }

  if (!subscription.stripe_subscription_id) {
    throw new BadRequestException('No Stripe subscription linked');
  }

  // Créer les Invoice Items dans Stripe
  const invoiceItems = await this.createCreditInvoiceItems(
    subscription,
    dto
  );

  // Créer une facture immédiate
  const invoice = await this.stripeService.createInvoice({
    customer: subscription.stripe_customer_id,
    subscription: subscription.stripe_subscription_id,
    auto_advance: true, // Finaliser automatiquement
    metadata: {
      type: 'extra_credits',
      subscription_id: subscription.id,
      admin_id: adminId,
    },
  });

  // Créer un enregistrement pending
  const pendingPurchase = await this.createPendingCreditPurchase(
    subscription,
    dto,
    invoice.id
  );

  // Audit
  await this.auditService.log({
    user_id: adminId,
    action: 'credits.purchase.initiated',
    entity_type: 'subscription',
    entity_id: subscriptionId,
    metadata: {
      credits: dto,
      invoice_id: invoice.id,
      amount: this.calculateCreditsCost(dto),
    },
  });

  return {
    success: true,
    invoice_id: invoice.id,
    purchase_id: pendingPurchase.id,
    status: 'pending_payment',
    hosted_invoice_url: invoice.hosted_invoice_url,
  };
}

private async createCreditInvoiceItems(
  subscription: Subscription,
  dto: AddCreditsDto
): Promise<Stripe.InvoiceItem[]> {
  const items = [];

  if (dto.articles > 0) {
    items.push(
      await this.stripeService.createInvoiceItem({
        customer: subscription.stripe_customer_id,
        price: process.env.STRIPE_PRICE_ARTICLE_CREDIT, // price_xxx depuis TASK-002
        quantity: dto.articles,
        description: `${dto.articles} crédits articles supplémentaires`,
        metadata: { type: 'article_credit' },
      })
    );
  }

  if (dto.socialPosts > 0) {
    items.push(
      await this.stripeService.createInvoiceItem({
        customer: subscription.stripe_customer_id,
        price: process.env.STRIPE_PRICE_SOCIAL_CREDIT,
        quantity: dto.socialPosts,
        description: `${dto.socialPosts} crédits posts sociaux supplémentaires`,
        metadata: { type: 'social_post_credit' },
      })
    );
  }

  if (dto.stories > 0) {
    items.push(
      await this.stripeService.createInvoiceItem({
        customer: subscription.stripe_customer_id,
        price: process.env.STRIPE_PRICE_STORY_CREDIT,
        quantity: dto.stories,
        description: `${dto.stories} crédits stories supplémentaires`,
        metadata: { type: 'story_credit' },
      })
    );
  }

  return items;
}
```

### 2. Table des achats pending
```typescript
// migration: CreateCreditPurchasesTable
export class CreateCreditPurchasesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'credit_purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'subscription_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'stripe_invoice_id',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'paid', 'failed', 'canceled'],
            default: "'pending'",
          },
          {
            name: 'articles',
            type: 'int',
            default: 0,
          },
          {
            name: 'social_posts',
            type: 'int',
            default: 0,
          },
          {
            name: 'stories',
            type: 'int',
            default: 0,
          },
          {
            name: 'total_amount',
            type: 'int',
            comment: 'Total in cents',
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }
}
```

### 3. Webhook handler pour confirmer l'achat
```typescript
// webhook.service.ts - Ajouter ce handler
private async handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  
  // Vérifier si c'est un achat de crédits
  if (invoice.metadata?.type !== 'extra_credits') {
    return;
  }

  // Trouver l'achat pending
  const purchase = await this.creditPurchaseRepo.findOne({
    where: { 
      stripe_invoice_id: invoice.id,
      status: 'pending',
    },
  });

  if (!purchase) {
    this.logger.warn(`No pending purchase found for invoice ${invoice.id}`);
    return;
  }

  // Mettre à jour la subscription avec les crédits
  const subscription = await this.subRepo.findOne({
    where: { id: purchase.subscription_id },
  });

  if (subscription) {
    subscription.extra_articles_purchased += purchase.articles;
    subscription.extra_social_posts_purchased += purchase.social_posts;
    subscription.extra_stories_purchased += purchase.stories;
    
    await this.subRepo.save(subscription);

    // Marquer l'achat comme payé
    purchase.status = 'paid';
    purchase.paid_at = new Date();
    await this.creditPurchaseRepo.save(purchase);

    // Audit
    await this.auditService.log({
      user_id: invoice.metadata.admin_id,
      action: 'credits.purchase.confirmed',
      entity_type: 'subscription',
      entity_id: subscription.id,
      metadata: {
        credits: {
          articles: purchase.articles,
          social_posts: purchase.social_posts,
          stories: purchase.stories,
        },
        invoice_id: invoice.id,
        amount_paid: invoice.amount_paid / 100,
      },
    });
  }
}
```

### 4. DTO pour l'ajout de crédits
```typescript
// dto/add-credits.dto.ts
export class AddCreditsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  articles?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  socialPosts?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  stories?: number = 0;

  @ValidateIf((o) => o.articles + o.socialPosts + o.stories === 0)
  @IsNotEmpty({ message: 'Au moins un type de crédit doit être ajouté' })
  _atLeastOne?: never;
}
```

### 5. Intégration avec l'existant
```typescript
// AdminUsersService.updateUserQuotas() - À adapter
async updateUserQuotas(
  userId: string,
  adminId: string,
  dto: UpdateUserQuotasDto
): Promise<ActionResponseDto> {
  // Si Stripe est configuré, utiliser le nouveau système
  if (user.subscription?.stripe_subscription_id) {
    // Rediriger vers le système Stripe
    const result = await this.subscriptionService.addCredits(
      user.subscription.id,
      {
        articles: dto.extraArticles,
        socialPosts: dto.extraSocialPosts,
        stories: dto.extraStories,
      },
      adminId
    );

    return {
      success: true,
      message: 'Facture créée, en attente de paiement',
      userId,
      action: 'quotas_invoice_created',
      details: {
        invoice_url: result.hosted_invoice_url,
        purchase_id: result.purchase_id,
      },
    };
  }

  // Sinon, utiliser l'ancien système (ajout direct)
  // ... code existant
}
```

## Dépendances

- **TASK-002** : Prix des crédits dans Stripe
- **TASK-003** : SubscriptionService
- **TASK-004** : Webhooks pour confirmation

## Risques

- **Double achat** : Vérifier l'idempotence
- **Paiement échoué** : Ne pas ajouter les crédits
- **Synchronisation** : Entre pending et confirmé

## Définition de "Done"

- [ ] Endpoint fonctionnel
- [ ] Invoice Items créés correctement
- [ ] Migration exécutée
- [ ] Documentation mise à jour

## Notes

- Les crédits ne sont ajoutés qu'après paiement confirmé
- supprimer l'ancien système pour les tests/dev sans Stripe
- Prévoir un endpoint pour vérifier le statut d'un achat
- Logger tous les événements liés aux crédits 