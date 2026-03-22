const hre = require("hardhat");

async function main() {
    console.log("Deploying TruthDAO...");

    const TruthDAO = await hre.ethers.getContractFactory("TruthDAO");
    const truthDAO = await TruthDAO.deploy();

    await truthDAO.waitForDeployment();

    const address = await truthDAO.getAddress();
    console.log("TruthDAO deployed to:", address);

    // We also want to save the ABI and Address for the frontend
    const fs = require("fs");
    const path = require("path");

    const deploymentInfo = {
        address: address,
        abi: truthDAO.interface.formatJson()
    };

    // Create a directory for frontend to pick up these files
    const frontendAssetsDir = path.join(__dirname, "../../frontend/src/contracts");
    if (!fs.existsSync(frontendAssetsDir)) {
        fs.mkdirSync(frontendAssetsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(frontendAssetsDir, "TruthDAO.json"),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Contract info saved to frontend/src/contracts/TruthDAO.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
