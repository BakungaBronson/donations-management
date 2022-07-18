import {loadStdlib, ask} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [ accCreator, accDonor, accUser ] =
  await stdlib.newTestAccounts(3, startingBalance);
const [ addrCreator, addrDonor, addrUser ] = 
  [ accCreator.getAddress(), accDonor.getAddress(), accUser.getAddress() ];
console.log(`ℹ️ Creator address: ${addrCreator} ℹ️
ℹ️ Donor address: ${addrDonor} ℹ️
ℹ️ User address: ${addrUser} ℹ️`);
console.log(`Initialised participant accounts with ${startingBalance}`);

console.log('Launching...');
const ctcCreator = accCreator.contract(backend);
const ctcDonor = accDonor.contract(backend, ctcCreator.getInfo());

const deadline = 100;

const sharedFunctions = {
  showFunds: async (funds, address) => {
    console.log(`✔️ Contract transferred ${funds} to user ${address} ✔️`);
    console.log(`
    
    ℹ️ Creator balance: ${await accCreator.balanceOf()} ℹ️
    ℹ️ Donor balance: ${await accDonor.balanceOf()} ℹ️
    ℹ️ User balance: ${await accUser.balanceOf()} ℹ️
    
    `);
  }
}

console.log('Starting backends...');
await Promise.all([
  backend.Creator(ctcCreator, {
    ...stdlib.hasRandom,
    ...sharedFunctions,
    // implement Alice's interact object here
    addUser: async () => {
      const address = await ask.ask(`Please enter the address of the user:`, (x => x));
      return address;
    },
    timesUp: async () => {
      await stdlib.wait(deadline);
      console.log(`⚠️ Time is up! ⚠️`)
    }
  }),
  backend.Donor(ctcDonor, {
    ...stdlib.hasRandom,
    ...sharedFunctions,
    // implement Bob's interact object here
    donateFunds: async () => {
      console.log(`Donor (${accDonor.getAddress()}) balance before: ${await accDonor.balanceOf()}`)
      const funds = await ask.ask(`Enter amount of funds to donate:`, parseInt);
      console.log(`Donated ${funds}!`)
      return funds;
    }
  }),
]);
ask.done();
console.log('Goodbye');
