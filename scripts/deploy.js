const { ethers, run, network } = require("hardhat");

const main = async () => {
  console.log("Deploying...");
  const bookingFactory = await ethers.getContractFactory("BookingStorage");
  const bookingContract = await bookingFactory.deploy();

  const book = await bookingContract.book();
  const currentStatus = await bookingContract.currentStatus();

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await bookingContract.deployTransaction.wait(6);
    await verify(bookingContract.address, []);
  }
};

const verify = async (contractAddress, args) => {
  console.log("Verifying...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.log(error);
    }
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
