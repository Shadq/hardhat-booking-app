const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("BookingStorage", () => {
  let bookingFactory, bookingContract;

  beforeEach(async () => {
    bookingFactory = await ethers.getContractFactory("BookingStorage");
    bookingContract = await bookingFactory.deploy();
  });

  it("Should verify that the address that deployed this contract is the same as the roomOwner variable", async () => {
    const sender = await bookingContract.signer.address;
    const roomOwner = await bookingContract.roomOwner();
    assert.equal(sender, roomOwner);
  });

  it("Should verify that the initial room status is set to vacant", async () => {
    const currentStatus = await bookingContract.currentStatus();
    assert.equal(currentStatus, 0);
  });

  it("Should verify that when the book function function is called it should set status to occupied", async () => {
    const book = await bookingContract.book();
    const currentStatus = await bookingContract.currentStatus();
    assert.equal(currentStatus, 1);
  });

  it("Should verify that when the room is booked and it's status is set to occupied it should throw an error", async () => {
    const book = await bookingContract.book();
    let err = 0;
    try {
      const secondBook = await bookingContract.book();
    } catch (error) {
      if (
        error.message.toLowerCase().includes("'currently occupied'") === true
      ) {
        err++;
      }
    }
    assert.equal(err, 1);
  });
});
