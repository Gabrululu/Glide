const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying TrialUSDC to Base Sepolia...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // Deploy TrialUSDC
    const TrialUSDC = await hre.ethers.getContractFactory("TrialUSDC");
    const trialUSDC = await TrialUSDC.deploy();
    await trialUSDC.waitForDeployment();

    const address = await trialUSDC.getAddress();
    console.log("\n✅ TrialUSDC deployed to:", address);
    console.log("📝 Add this to your .env.local:");
    console.log(`NEXT_PUBLIC_TRIAL_USDC=${address}\n`);

    // Wait for a few block confirmations
    console.log("⏳ Waiting for block confirmations...");
    await trialUSDC.deploymentTransaction().wait(5);

    // Verify on BaseScan
    console.log("🔍 Verifying contract on BaseScan...");
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [],
        });
        console.log("✅ Contract verified!");
    } catch (error) {
        console.log("⚠️  Verification failed:", error.message);
    }

    console.log("\n🎉 Deployment complete!");
    console.log(`View on BaseScan: https://sepolia.basescan.org/address/${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
