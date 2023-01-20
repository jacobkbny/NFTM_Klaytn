import axios from "axios";
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, COUNT_CONTRACT_ADDRESS,NFT_CONTRACT_ADDRESS,CHAIN_ID} from'../constants';

const option = {
    headers: {
        Authorization:"Basic "+ Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
        "x-chain-id": CHAIN_ID,
        "Content-Type": "application/json",
    }
}

// const option = {
//     headers: [
//       {
//         name: "Authorization",
//         value:
//           "Basic " +
//           Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
//       },
//       { name: "x-chain-id", value: CHAIN_ID },
//     ],
//   };
// export const uploadMetadata = async (imageUrl,title,desc) => {
//     console.log(imageUrl,title,desc);
//         const metadata = {
//             meatdata: {
//                 name: title,
//                 description: desc,
//                 image: imageUrl
//             }
//         }

//         try{
//             const response = await axios.post("https://metadata-api.klaytnapi.com/v1/metadata",metadata, option);
//             console.log(`${JSON.stringify(response.data)}`);
//             return response.data.uri
//         }catch(e){
//             console.log(e)
//             return false
//         }

// }

export const uploadMetadata = async (imageUrl) => {
        const _name = "mynft"
        const _desc = "this is mine"
        const metadata = {
            meatdata: {
                name: _name,
                description: _desc,
                image: imageUrl
            }
        }
        try{
            const response = await axios.post("https://metadata-api.klaytnapi.com/v1/metadata",metadata, option);
            console.log(`${JSON.stringify(response.data)}`);
            return response.data.uri
        }catch(e){
            console.log(`Error message :${e}`)
            return false
        }

}