// Premium Service
import { PremiumPackage, PremiumSubscription } from '@/types/premium.types';
import { MOCK_PREMIUM_PACKAGES } from './mockData';

class PremiumService {
  async getPackages(): Promise<PremiumPackage[]> {
    // Always mock for now — backend doesn't have premium endpoints yet
    return MOCK_PREMIUM_PACKAGES;
  }

  async subscribe(packageId: string): Promise<PremiumSubscription> {
    const pkg = MOCK_PREMIUM_PACKAGES.find(p => p.id === packageId);
    if (!pkg) throw new Error('Package not found');

    const now = new Date();
    const end = new Date(now.getTime() + pkg.duration * 30 * 86400000);

    return {
      id: 'sub_' + Date.now(),
      companyId: 1,
      packageId,
      tier: pkg.tier,
      status: 'ACTIVE',
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      autoRenew: true,
    };
  }

  async getSubscriptionStatus(): Promise<PremiumSubscription | null> {
    return null; // No active subscription for demo user
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    console.log('Cancelled subscription:', subscriptionId);
  }
}

export const premiumService = new PremiumService();
export default premiumService;
