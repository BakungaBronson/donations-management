'reach 0.1';

const sharedFunctions = {
  showFunds: Fun([UInt, Address], Null),
}

export const main = Reach.App(() => {
  const Creator = Participant('Creator', {
    // Specify Creators's interact interface here
    ...sharedFunctions,
    addUser: Fun([], Address),
    timesUp: Fun([], Null)
  });
  const Donor = Participant('Donor', {
    // Specify Donor's interact interface here
    ...sharedFunctions,
    donateFunds: Fun([], UInt)
  });
  init();
  // The first one to publish deploys the contract
  Creator.only(() => {
    const address = declassify(interact.addUser());
  })
  Creator.publish(address);
  commit();
  // The second one to publish always attaches
  Donor.only(() => {
    const amountToDonate = declassify(interact.donateFunds())
  })
  Donor.publish(amountToDonate).pay(amountToDonate);
  commit();

  Creator.only(() => {
    interact.timesUp();
  });
  Creator.publish();

  transfer(amountToDonate).to(address);
  commit();

  each([Creator, Donor], () => {
    interact.showFunds(amountToDonate, address);
  })

  exit();
});
