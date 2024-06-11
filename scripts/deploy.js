const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Voting = await ethers.getContractFactory("Voting");
    const proposalNames = [
        "Party A",
        "Party B",
        "Party C",
        "Party D",
        "Party E"
    ];
    const voting = await Voting.deploy(proposalNames);

    console.log("Waiting for the contract to be deployed...");

    // Wait for the contract to be deployed
    await voting.deploymentTransaction().wait();

    console.log("Voting deployed to:", voting.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
