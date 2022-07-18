'reach 0.1';

export const main = Reach.App(() => {
  const Creator = Participant('Creator', {
    // Specify Alice's interact interface here
  });
  const Donor = Participant('Donor', {
    // Specify Bob's interact interface here
  });
  init();
  // The first one to publish deploys the contract
  Creator.publish();
  commit();
  // The second one to publish always attaches
  Donor.publish();
  commit();
  // write your program here
  exit();
});
