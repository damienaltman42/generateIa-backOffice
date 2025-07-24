# TASK-001: Infrastructure Stripe de Base

**Type**: Backend Development  
**Priorité**: 🔴 Critique  
**Estimation**: 0.5 jour  
**Assigné à**: [Dev Backend]  
**Sprint**: Phase 4 - Sprint 1  

## Description

Mettre en place l'infrastructure de base pour l'intégration Stripe dans le backend. Cette tâche pose les fondations pour toutes les autres fonctionnalités Stripe.

## Contexte

- Le SDK Stripe n'est pas installé
- Aucune configuration Stripe n'existe
- Les entités ont déjà les colonnes nécessaires (stripe_customer_id, etc.)

## Critères d'acceptation

- [x] SDK Stripe installé et typé
- [x] Module Stripe créé et configuré
- [x] Service Stripe wrapper fonctionnel
- [x] Configuration sécurisée des clés API
- [x] Gestion des erreurs Stripe standardisée

## Tâches techniques

### 1. Installation des dépendances
```bash
npm install stripe @types/stripe
```

### 2. Créer la structure du module
```
src/admin/modules/stripe/
├── stripe.module.ts
├── stripe.service.ts
├── stripe.config.ts
├── dto/
│   └── stripe-error.dto.ts
```

### 3. Configuration Stripe
```typescript
// stripe.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',
}));
```

### 4. Service Stripe wrapper
```typescript
// stripe.service.ts
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private config: ConfigType<typeof stripeConfig>,
  ) {
    this.stripe = new Stripe(this.config.secretKey, {
      apiVersion: this.config.apiVersion,
    });
  }

  // Méthodes wrapper pour chaque fonctionnalité Stripe
  async createCustomer(data: Stripe.CustomerCreateParams) {
    try {
      return await this.stripe.customers.create(data);
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  private handleStripeError(error: any): HttpException {
    // Gestion standardisée des erreurs Stripe
  }
}
```

### 5. Variables d'environnement
```env
# .env.example
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2023-10-16
```

## Dépendances

- Aucune dépendance sur d'autres tâches
- Bloque toutes les autres tâches Stripe

## Risques

- **Sécurité des clés** : S'assurer que les clés ne sont jamais exposées
- **Version API** : Fixer la version pour éviter les breaking changes

## Définition de "Done"

- [x] Code review approuvée
- [x] Variables d'environnement documentées
- [x] Aucune clé API dans le code
- [x] Module exporté dans AppModule

## Notes

- Utiliser le mode test de Stripe pour le développement
- Prévoir un logger spécifique pour les appels Stripe
- Implémenter un retry mechanism pour les erreurs réseau 