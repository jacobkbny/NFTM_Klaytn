import axios from "axios";
import { COUNT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS,MARKET_CONTRACT_ADDRESS } from "../constants";

const A2A_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare"
const APP_NAME = "nft-market"
const isMobile = window.screen.width >= 1200 ? false : true;


const getKlipAcessUrl = (method, request_key) => {
    if (method === "QR") {
        return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    }
        return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    }

export const purchaseCard = async (
    tokenId,
    setQrvalue,
    callback
    ) => {
        const functionJSON = '{ "constant": false, "inputs": [ { "name": "tokenID", "type": "uint256" }, { "name": "NFTAddress", "type": "address" } ], "name": "PurchaseNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
        const params =`[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`
        executeContract(
            MARKET_CONTRACT_ADDRESS,
            functionJSON,
            "10000000000000000",
            params,
            setQrvalue,
            callback
            )
}

export const listingCard = async (
    fromAddress,
    tokenId,
    setQrvalue,
    callback
    ) => {
        const functionJSON = '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
        const params =`[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`
        executeContract(
            NFT_CONTRACT_ADDRESS,
            functionJSON,
            "0",
            params,
            setQrvalue,
            callback
            )
}

export const mintCardWithURI = async (
    toAddress,
    tokenId,
    uri,
    setQrvalue,
    callback
    ) => {
        const functionJSON = '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
        const params =`[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`
        executeContract(
            NFT_CONTRACT_ADDRESS,
            functionJSON,
            "0",
            params,
            setQrvalue,
            callback
            )
}

export const executeContract = (
    txTo,
    functionJSON,
    value,
    params,
    setQrvalue,
    callback
    ) => {
    axios.post(
        A2A_API_PREPARE_URL,{
            bapp:{
                name:APP_NAME     
            },
            type:"execute_contract",
            transaction:{
                to:txTo,
                abi:functionJSON,
                value:value,
                params:params
           }
        }
    ).then((response) => {
        const request_key = response.data.request_key;
        if (isMobile){
            window.location.href = getKlipAcessUrl("MOBILE", request_key);
        }else {
            setQrvalue(getKlipAcessUrl("QR", request_key));
        }
        let timeId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result){
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    callback(res.data.result);
                    if (res.data.result.status === 'success'){
                        clearInterval(timeId)
                        setQrvalue("DEFAULT");
                    }
                }
            }) 
        },1000)
    })
}
// 

export const getAddress = (setQrvalue, callback) => {
        axios.post(
            A2A_API_PREPARE_URL,{
                bapp:{
                    name:APP_NAME
                },
                type:"auth"
            }
        ).then((response) => {
            const request_key = response.data.request_key;
            if (isMobile){
                window.location.href = getKlipAcessUrl("MOBILE", request_key);
            }else {
                setQrvalue(getKlipAcessUrl("QR", request_key));
            }
            let timeId = setInterval(() => {
                axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                    if (res.data.result){
                        console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                        callback(res.data.result.klaytn_address)
                        clearInterval(timeId)
                        setQrvalue("DEFAULT");
                    }
                }) 
            },1000)
        })
}

// export const setCount = (count,setQrvalue) => {
    //     axios.post(
    //         A2A_API_PREPARE_URL,{
    //             bapp:{
    //                 name:APP_NAME     
    //             },
    //             type:"execute_contract",
    //             transaction:{
    //                 to:COUNT_CONTRACT_ADDRESS,
    //                 abi:'{"inputs": [ { "internalType": "uint256", "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }',
    //                 value:"0",
    //                 params: `[\"${count}\"]`
    //            }
    //         }
    //     ).then((response) => {
    //         const request_key = response.data.request_key;
    //         const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
    //         setQrvalue(qrcode);
    //         let timeId = setInterval(() => {
    //             axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
    //                 if (res.data.result){
    //                     console.log(`[Result] ${JSON.stringify(res.data.result)}`);
    //                     if (res.data.result.status === 'success'){
    //                         clearInterval(timeId)
    //                     }
    //                 }
    //             }) 
    //         },1000)
    //     })
    // }