import { UniswapService, type UniswapPool } from './UniswapService';

/**
 * Agent Service - The "Brain" of Glide
 * Makes intelligent decisions about DeFi strategies
 * 
 * For hackathon: Rule-based logic
 * In production: Could integrate with AI/ML models
 */

export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

export interface UserProfile {
    address: string;
    riskTolerance: RiskTolerance;
    investmentAmount: string;
    goal: 'passive_income' | 'growth' | 'balanced';
}

export interface Strategy {
    id: string;
    name: string;
    description: string;
    recommendedPool: UniswapPool;
    expectedReturn: string;
    riskLevel: 'low' | 'medium' | 'high';
    reasoning: string[];
}

export interface AgentAnalysis {
    status: 'analyzing' | 'complete' | 'error';
    strategies: Strategy[];
    recommendedStrategy: Strategy | null;
    marketConditions: {
        totalPools: number;
        avgAPY: string;
        bestAPY: string;
    };
}

export class AgentService {
    /**
     * Analyze market and suggest optimal strategies
     * This is the core "intelligence" of the agent
     */
    static async analyzeMarket(userProfile: UserProfile): Promise<AgentAnalysis> {
        // Simulate "thinking" time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Fetch available pools
        const allPools = await UniswapService.getAvailablePools();

        // Calculate market conditions
        const totalPools = allPools.length;
        const avgAPY = this.calculateAverageAPY(allPools);
        const bestAPY = Math.max(...allPools.map(p => parseFloat(p.apy))).toFixed(1) + '%';

        // Generate strategies based on user profile
        const strategies = this.generateStrategies(userProfile, allPools);

        // Select recommended strategy
        const recommendedStrategy = this.selectBestStrategy(strategies, userProfile);

        return {
            status: 'complete',
            strategies,
            recommendedStrategy,
            marketConditions: {
                totalPools,
                avgAPY,
                bestAPY,
            },
        };
    }

    /**
     * Generate multiple strategy options for the user
     */
    private static generateStrategies(
        userProfile: UserProfile,
        pools: UniswapPool[]
    ): Strategy[] {
        const strategies: Strategy[] = [];

        // Strategy 1: Conservative (Stablecoin pools)
        const stablePools = pools.filter(p => p.riskLevel === 'low');
        if (stablePools.length > 0) {
            const bestStable = stablePools.sort((a, b) =>
                parseFloat(b.apy) - parseFloat(a.apy)
            )[0];

            strategies.push({
                id: 'conservative',
                name: 'Stable Income',
                description: 'Low-risk stablecoin pools for steady returns',
                recommendedPool: bestStable,
                expectedReturn: this.calculateExpectedReturn(
                    userProfile.investmentAmount,
                    bestStable.apy
                ),
                riskLevel: 'low',
                reasoning: [
                    'Minimal impermanent loss risk',
                    'Predictable returns',
                    'High liquidity for easy exit',
                ],
            });
        }

        // Strategy 2: Moderate (ETH/BTC pairs)
        const moderatePools = pools.filter(p => p.riskLevel === 'medium');
        if (moderatePools.length > 0) {
            const bestModerate = moderatePools.sort((a, b) =>
                parseFloat(b.apy) - parseFloat(a.apy)
            )[0];

            strategies.push({
                id: 'moderate',
                name: 'Balanced Growth',
                description: 'Moderate risk with blue-chip crypto pairs',
                recommendedPool: bestModerate,
                expectedReturn: this.calculateExpectedReturn(
                    userProfile.investmentAmount,
                    bestModerate.apy
                ),
                riskLevel: 'medium',
                reasoning: [
                    'Higher APY than stablecoins',
                    'Established token pairs',
                    'Volatility dampening Hook active',
                ],
            });
        }

        // Strategy 3: Aggressive (High-yield volatile pairs)
        const aggressivePools = pools.filter(p => p.riskLevel === 'high');
        if (aggressivePools.length > 0) {
            const bestAggressive = aggressivePools.sort((a, b) =>
                parseFloat(b.apy) - parseFloat(a.apy)
            )[0];

            strategies.push({
                id: 'aggressive',
                name: 'Maximum Yield',
                description: 'High-risk, high-reward volatile pairs',
                recommendedPool: bestAggressive,
                expectedReturn: this.calculateExpectedReturn(
                    userProfile.investmentAmount,
                    bestAggressive.apy
                ),
                riskLevel: 'high',
                reasoning: [
                    'Highest APY available',
                    'Potential for significant gains',
                    'Only for experienced users',
                ],
            });
        }

        return strategies;
    }

    /**
     * Select the best strategy based on user profile
     */
    private static selectBestStrategy(
        strategies: Strategy[],
        userProfile: UserProfile
    ): Strategy | null {
        if (strategies.length === 0) return null;

        // Map risk tolerance to strategy preference
        const riskMap: Record<RiskTolerance, string> = {
            conservative: 'conservative',
            moderate: 'moderate',
            aggressive: 'aggressive',
        };

        // Map goal to strategy preference
        const goalMap: Record<UserProfile['goal'], string> = {
            passive_income: 'conservative',
            balanced: 'moderate',
            growth: 'aggressive',
        };

        // Combine risk tolerance and goal (risk tolerance takes priority)
        const preferredStrategyId = riskMap[userProfile.riskTolerance];

        // Find matching strategy
        const preferred = strategies.find(s => s.id === preferredStrategyId);

        // Fallback to first available strategy
        return preferred || strategies[0];
    }

    /**
     * Calculate expected monthly return
     */
    private static calculateExpectedReturn(amount: string, apy: string): string {
        const principal = parseFloat(amount);
        const annualRate = parseFloat(apy) / 100;
        const monthlyReturn = (principal * annualRate) / 12;
        return `$${monthlyReturn.toFixed(2)}/month`;
    }

    /**
     * Calculate average APY across all pools
     */
    private static calculateAverageAPY(pools: UniswapPool[]): string {
        const total = pools.reduce((sum, pool) => sum + parseFloat(pool.apy), 0);
        const avg = total / pools.length;
        return `${avg.toFixed(1)}%`;
    }

    /**
     * Execute a strategy (deploy funds to the selected pool)
     */
    static async executeStrategy(
        strategy: Strategy,
        userAddress: string,
        amount: string
    ): Promise<{ success: boolean; positionId: string }> {
        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Call UniswapService to add liquidity
        const result = await UniswapService.addLiquidity(
            strategy.recommendedPool.id,
            amount,
            strategy.recommendedPool.token0
        );

        return result;
    }
}
