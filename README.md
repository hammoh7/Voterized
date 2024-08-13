# Voterized 
## Decentralized Voting application
### Voterized is a decentralized voting application where a Chairperson can give rights to for voters to vote by entering their voting addresses. These voters with allocated rights can then vote to their favourite party. The results of the winning parties are also seen in real-time.

### Steps to Setup

1. Clone the project
   ```
   git clone https://github.com/hammoh7/Voterized.git
   ```
2. Installing dependencies
   ```
   npm install
   ```
   ```
   cd frontend
   npm install
   ```
3. Run following commands in root directory
   ```
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Create a .env file in both root directory and frontend folder<br>
   *Root folder*<br>
   1. Create an account on Infura and paste the API key below.<br>
   2. Paste the private key of your Metamask wallet
   ```
   INFURA_API_KEY=
   PRIVATE_KEY=
   ```
   *Frontend folder*<br>
   Paste the contract address where your smart contract is deployed that was generated by command 'npx hardhat run scripts/deploy.js --network sepolia'<br>
   ```
   REACT_APP_CONTRACT_ADDRESS=
   ```
5. Create a new file contractABI.js in frontend/src folder. Then copy the ABI content (array) from artifacts/contracts/Voting.json. The contractABI.js file should be like as below:
   ```
   export const contractABI = [
      // Your ABI content
   ]
   ```
6. Then start the application
   ```
   cd frontend
   npm start
   ```

## Note - This project works only on SepoliaETH test network


## Simulation of application

- The private key of your wallet which you provided in your code, is your Chairperson wallet. Only that particular wallet will have the Chairperson authority
- With that Chairperson wallet you have the authority to give voting rights to any other person by entering their wallet addresses.
- Then those voters having voting rights can vote to their favorite party.

   
