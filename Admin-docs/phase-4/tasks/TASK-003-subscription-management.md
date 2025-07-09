# TASK-003: Gestion Admin des Subscriptions

**Type**: Backend Development  
**Priorité**: 🟡 Moyenne  
**Estimation**: 1.5 jours  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 1  
**Dépend de**: TASK-001, TASK-002  

## Description

Implémenter les endpoints admin pour **consulter, corriger et synchroniser** les subscriptions avec Stripe. Cette tâche ne concerne PAS la gestion métier des abonnements (qui se fait via Stripe Checkout + Webhooks), mais uniquement les outils admin pour monitoring et correction.

## Contexte

- Les utilisateurs gèrent leurs abonnements via le frontend + Stripe Checkout
- Les webhooks synchronisent automatiquement les données (TASK-004)
- Les admins ont besoin d'outils pour consulter, corriger et gérer les cas d'exception

## Critères d'acceptation

- [ ] Consultation complète des subscriptions (listing + détail)
- [ ] Correction manuelle des statuts après échec de paiement
- [ ] Synchronisation manuelle avec Stripe en cas de désynchronisation
- [ ] Ajout de crédits gratuits (gestes commerciaux)
- [ ] Logs et audit de toutes les actions admin

## Tâches techniques

### 1. Module Subscriptions
```typescript
// subscription.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, User, Plan]),
    StripeModule,
    ConsumptionModule,
    AuditModule,
  ],
  controllers: [AdminSubscriptionsController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
```

### 2. Service de gestion des subscriptions
```typescript
// subscription.service.ts
@Injectable()
export class SubscriptionService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private auditService: AuditService,
  ) {}

  // Consultation
  async findAll(query: ListSubscriptionsDto): Promise<PaginatedResult<Subscription>> {
    const queryBuilder = this.subRepo
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('subscription.plan', 'plan');

    // Filtres
    if (query.status) {
      queryBuilder.andWhere('subscription.status = :status', { status: query.status });
    }
    if (query.planId) {
      queryBuilder.andWhere('subscription.plan_id = :planId', { planId: query.planId });
    }
    if (query.search) {
      queryBuilder.andWhere(
        '(user.email LIKE :search OR user.name LIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    return await paginate(queryBuilder, query);
  }

  async findOneWithDetails(id: string): Promise<Subscription> {
    const subscription = await this.subRepo.findOne({
      where: { id },
      relations: ['user', 'plan', 'consumption_history'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription ${id} not found`);
    }

    return subscription;
  }

  // Correction manuelle du statut
  async updateStatus(
    id: string,
    status: SubscriptionStatus,
    adminId: string,
    reason?: string
  ): Promise<Subscription> {
    const subscription = await this.findOneWithDetails(id);
    const oldStatus = subscription.status;

    subscription.status = status;
    
    // Gestion spéciale pour le passage en FREE
    if (status === SubscriptionStatus.CANCELED || status === SubscriptionStatus.EXPIRED) {
      subscription.canceled_at = new Date();
      // Réinitialiser les crédits supplémentaires
      subscription.extra_articles_purchased = 0;
      subscription.extra_social_posts_purchased = 0;
      subscription.extra_stories_purchased = 0;
    }

    const savedSubscription = await this.subRepo.save(subscription);

    // Audit
    await this.auditService.log({
      user_id: adminId,
      action: 'subscription.status.updated',
      entity_type: 'subscription',
      entity_id: id,
      metadata: {
        old_status: oldStatus,
        new_status: status,
        reason: reason || 'Manual admin correction',
      },
    });

    return savedSubscription;
  }

  // Synchronisation avec Stripe
  async syncWithStripe(id: string, adminId: string): Promise<Subscription> {
    const subscription = await this.findOneWithDetails(id);

    if (!subscription.stripe_subscription_id) {
      throw new BadRequestException('No Stripe subscription linked');
    }

    // Récupérer les données depuis Stripe
    const stripeSubscription = await this.stripeService.retrieveSubscription(
      subscription.stripe_subscription_id
    );

    // Synchroniser les données
    const oldData = { ...subscription };
    
    subscription.status = this.mapStripeStatus(stripeSubscription.status);
    subscription.current_period_start = new Date(stripeSubscription.current_period_start * 1000);
    subscription.current_period_end = new Date(stripeSubscription.current_period_end * 1000);
    subscription.canceled_at = stripeSubscription.canceled_at 
      ? new Date(stripeSubscription.canceled_at * 1000) 
      : null;

    const savedSubscription = await this.subRepo.save(subscription);

    // Audit
    await this.auditService.log({
      user_id: adminId,
      action: 'subscription.synced',
      entity_type: 'subscription',
      entity_id: id,
      metadata: {
        stripe_subscription_id: stripeSubscription.id,
        changes: this.detectChanges(oldData, savedSubscription),
      },
    });

    return savedSubscription;
  }

  // Ajout de crédits gratuits
  async addFreeCredits(
    id: string,
    credits: AddFreeCreditsDto,
    adminId: string
  ): Promise<Subscription> {
    const subscription = await this.findOneWithDetails(id);

    // Ajouter les crédits
    if (credits.articles > 0) {
      subscription.extra_articles_purchased += credits.articles;
    }
    if (credits.social_posts > 0) {
      subscription.extra_social_posts_purchased += credits.social_posts;
    }
    if (credits.stories > 0) {
      subscription.extra_stories_purchased += credits.stories;
    }

    const savedSubscription = await this.subRepo.save(subscription);

    // Audit
    await this.auditService.log({
      user_id: adminId,
      action: 'subscription.credits.added',
      entity_type: 'subscription',
      entity_id: id,
      metadata: {
        credits_added: credits,
        reason: credits.reason || 'Free credits from admin',
      },
    });

    return savedSubscription;
  }

  private mapStripeStatus(stripeStatus: string): SubscriptionStatus {
    const mapping = {
      'active': SubscriptionStatus.ACTIVE,
      'trialing': SubscriptionStatus.TRIAL,
      'past_due': SubscriptionStatus.PAST_DUE,
      'canceled': SubscriptionStatus.CANCELED,
      'unpaid': SubscriptionStatus.EXPIRED,
    };
    return mapping[stripeStatus] || SubscriptionStatus.EXPIRED;
  }

  private detectChanges(oldData: any, newData: any): any {
    const changes = {};
    const fields = ['status', 'current_period_start', 'current_period_end', 'canceled_at'];
    
    fields.forEach(field => {
      if (oldData[field] !== newData[field]) {
        changes[field] = { old: oldData[field], new: newData[field] };
      }
    });
    
    return changes;
  }
}
```

### 3. Controller Admin
```typescript
// admin-subscriptions.controller.ts
@Controller('admin/subscriptions')
export class AdminSubscriptionsController {
  constructor(
    private subscriptionService: SubscriptionService,
    private consumptionService: ConsumptionService,
  ) {}

  @Get()
  async listSubscriptions(@Query() query: ListSubscriptionsDto) {
    return this.subscriptionService.findAll(query);
  }

  @Get(':id')
  async getSubscription(@Param('id') id: string) {
    const subscription = await this.subscriptionService.findOneWithDetails(id);
    
    // Inclure les données de consommation
    const consumption = await this.consumptionService.getUserConsumption(
      subscription.user_id
    );
    
    return {
      ...subscription,
      consumption,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Req() req: any
  ) {
    return this.subscriptionService.updateStatus(
      id,
      dto.status,
      req.user.id,
      dto.reason
    );
  }

  @Post(':id/sync')
  async syncWithStripe(
    @Param('id') id: string,
    @Req() req: any
  ) {
    return this.subscriptionService.syncWithStripe(id, req.user.id);
  }

  @Post(':id/add-credits')
  async addFreeCredits(
    @Param('id') id: string,
    @Body() dto: AddFreeCreditsDto,
    @Req() req: any
  ) {
    return this.subscriptionService.addFreeCredits(id, dto, req.user.id);
  }
}
```

### 4. DTOs
```typescript
// dto/list-subscriptions.dto.ts
export class ListSubscriptionsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  createdBefore?: string;
}

// dto/update-status.dto.ts
export class UpdateStatusDto {
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

// dto/add-free-credits.dto.ts
export class AddFreeCreditsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  articles?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  social_posts?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  stories?: number = 0;

  @IsOptional()
  @IsString()
  reason?: string;
}
```

## Endpoints finaux

### Consultation
- `GET /admin/subscriptions` - Liste avec filtres (status, plan, search, dates)
- `GET /admin/subscriptions/:id` - Détail + consommation

### Correction
- `PATCH /admin/subscriptions/:id/status` - Corriger le statut manuellement
- `POST /admin/subscriptions/:id/sync` - Resynchroniser avec Stripe

### Gestes commerciaux
- `POST /admin/subscriptions/:id/add-credits` - Ajouter des crédits gratuits

## Dépendances

- **TASK-001** : StripeService requis
- **TASK-002** : Plans synchronisés avec Stripe
- **TASK-004** : Webhooks pour synchronisation automatique (complémentaire)

## Risques

- **Désynchronisation** : Entre actions admin et webhooks Stripe
- **Conflits** : Si admin modifie pendant qu'un webhook arrive
- **Cohérence** : Vérifier que les corrections admin sont cohérentes

## Définition de "Done"

- [ ] Tous les endpoints fonctionnels
- [ ] Filtres et pagination opérationnels
- [ ] Synchronisation avec Stripe validée
- [ ] Gestion d'erreurs robuste
- [ ] Logs et audit complets
- [ ] Tests unitaires et d'intégration

## Notes

- Cette tâche est complémentaire aux webhooks (TASK-004)
- Les admins ne créent/modifient PAS les abonnements métier
- Focus sur monitoring, correction et cas d'exception
- Toujours logger les actions admin pour audit 