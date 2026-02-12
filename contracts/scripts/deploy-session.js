const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying GlideSession to Base Sepolia...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // Deploy GlideSession
    const GlideSession = await hre.ethers.getContractFactory("GlideSession");
    const glideSession = await GlideSession.deploy();
    await glideSession.waitForDeployment();

    const address = await glideSession.getAddress();
    console.log("\n✅ GlideSession deployed to:", address);
    console.log("📝 Add this to your .env.local:");
    console.log(`NEXT_PUBLIC_SESSION_CONTRACT=${address}\n`);

    // Wait for a few block confirmations
    console.log("⏳ Waiting for block confirmations...");
    await glideSession.deploymentTransaction().wait(5);

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
