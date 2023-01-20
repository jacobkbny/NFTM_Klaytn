import axios from "axios";
import Caver from "caver-js";
// import CounterABI from '../abi/CounterABI.json'
import KIP17TokenABI from '../abi/KIP17TokenABI.json'
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, COUNT_CONTRACT_ADDRESS,NFT_CONTRACT_ADDRESS,CHAIN_ID} from'../constants';

// const JSONED_CounterABI = JSON.stringify(CounterABI)
const JSONED_KIP17TokenABI = JSON.stringify(KIP17TokenABI)


const option = {
    headers: [
      {
        name: "Authorization",
        value:
          "Basic " +
          Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
      },
      { name: "x-chain-id", value: CHAIN_ID },
    ],
  };
  const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn",option));
  const NFTContract = new caver.contract(JSON.parse(JSONED_KIP17TokenABI),NFT_CONTRACT_ADDRESS);

  // 1. Smart contract Deploy 
  // 2. caver.js link the smart contract
  // 3. display the data from the smart contract
  export const fetchCardsof = async(address) => {
      // fetch Balance
      const balance = await NFTContract.methods.balanceOf(address).call();
      console.log(`NFT Balance: ${balance}`);
      // Fetch Token IDs
      const tokenIds = [];
      for (let i = 0; i<balance; i++){
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address,i).call();
        tokenIds.push(id)
      }
      // Fetch Token URIs
      const tokenUris = [];
      for (let i = 0; i<balance; i++){
        const metadata_Url = await NFTContract.methods.tokenURI(tokenIds[i]).call(); // -> metadata KAS address
        const response = await axios.get(metadata_Url)
        const uriJSON = response.data
        tokenUris.push(uriJSON.image);
      }
      const nfts = [];
      for (let i=0; i<balance; i++){
        nfts.push({uri:tokenUris[i],id:tokenIds[i]});
      }
      console.log(nfts);
      return nfts;
  }
  export const getBalance = (address) => {
    return caver.rpc.klay.getBalance(address).then((response) =>{
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      console.log(`BALANCE:${balance}`);
      return balance;
    })
  }
  // const CountContract = new caver.contract(JSON.parse(JSONED_CounterABI),COUNT_CONTRACT_ADDRESS);
  // export const readCount = async() => {
  //   const _count = await CountContract.methods.count().call();
  //   console.log(_count);
  // }
  // export const setCount = async (newCount) => {
  //   // 사용할 account 설정
  //   try{
  //     const privatekey= "0x2f10b29a315b39c44430ae511a5dc7d108a06f1315002937dd3d1f4d7ce7f5ef";
  //     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
  //     caver.wallet.add(deployer);
      
  //     // 스마트 컨트랙트 실행 트랜잭션 날리기
  //     // 결과 확인
      
  //     const receipt = await CountContract.methods.setCount(newCount).send({
  //       from: deployer.address,// address
  //       gas:"0x4bfd200" //
        
  //     })
  //     console.log(receipt);
  //     }catch(e){
  //       console.log(`ERROR_SET_COUNT: ${e.message}`);
  //     }
  //   }