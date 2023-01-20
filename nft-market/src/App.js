import React, {useEffect, useState} from 'react';
import QRCode from "qrcode.react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHome, faWallet ,faPlus}from "@fortawesome/free-solid-svg-icons"
import {fetchCardsof, getBalance} from './api/UseCaver'
import * as KlipAPI from './api/UseKlip';
import * as KasAPI from './api/UseKas';
import "bootstrap/dist/css/bootstrap.min.css";
import {Alert, Button, Card, Col, Container, Form, Modal, Nav, Row} from "react-bootstrap";

import './App.css';
import './market.css';
import { MARKET_CONTRACT_ADDRESS } from './constants';

// const onPressButton = (_balance, _setBalance) => {
//     _setBalance(_balance);
// }

const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000"
const MYADDRESS = "0x37bd50665A4A2b3F60522540053c367155165b53"
function App() {
  // State Data
  
  //Global Data
  // address 
  // nft 
      
  // getBalance("0x9c1d730ad65c6246b6a7cb7f1a79980ee404403b");
  const [nfts, setNfts] = useState([]); // {tokenId: '101', tokenrui:""}
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // UI
  const [qrvalue , setQrvalue] = useState(DEFAULT_QR_CODE)
  const [tab, setTab] = useState("MARKET") // MARKET , MINT , WALLET
  const [mintImageUrl , setMintImageUrl] = useState("");
  const [mintTokenID, setMintTokenID] = useState("");
  const [title , setTitle] = useState("")
  const [desc, setDesc] = useState("");


  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title:"MODAL",
    onConfirm: () => {},

  })
  const rows = nfts.slice(nfts.length/2);

  // fetchMarketNFTs
  const fetchMarketNFTs = async () => {
    const _nfts = await fetchCardsof(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  }
  // fetchMyNFTs
  const fetchMyNFTs = async () => {
    if (myAddress === DEFAULT_ADDRESS){
      alert("Please Sign-in with QR Code")
      return 
    }   
    const _nfts = await fetchCardsof(myAddress);
    setNfts(_nfts);
  }
  // onClickMint
  const onClickMint = async (uri, tokenID) => {
    if (myAddress === DEFAULT_ADDRESS){
      alert("Please Sign-in with QR Code")
      return;
    }
    // {option} asset upload api 

    // metadata upload
    const metadataURL = KasAPI.uploadMetadata(uri,title,desc);
    if  (!metadataURL){
        alert("Failed to upload metadata")
        return ;
    }

    // const randomTokenId = parseInt(Math.random()* 1000000000)
    KlipAPI.mintCardWithURI(
      myAddress,
      tokenID,
      metadataURL,
      setQrvalue,
      (result) => {
      alert(JSON.stringify(result));
      }
    )
  }
  const onClickCard = (id) => {
      if(tab === "WALLET") {
        setModalProps({
          title: "Want to Sell your NFT?",
          onConfirm: () => {
            onClickMyCard(id);
          }
        })
      }
      // onClickMarketCard
      if(tab === "MARKET"){
        setModalProps({
          title: "Want to Buy This NFT?",
          onConfirm: () => {
            onClickMarketCard(id);
          }
        })
      }
      setShowModal(true)
  }
  const onClickMyCard = (tokenID) => {
    
    KlipAPI.listingCard(MYADDRESS, tokenID, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    })
  }
  const onClickMarketCard = (tokenID) => {
    KlipAPI.purchaseCard(tokenID,setQrvalue, (result) => {
      alert(JSON.stringify(result));
    })
  }


  const getUserData = () => {
    setModalProps({
      title:"Want to Connect your Kilp Wallet?",
      onConfirm: () => {
        KlipAPI.getAddress(setQrvalue,async (address) =>{
          setMyAddress(address);
          const _balance = await getBalance(address);
          setMyBalance(_balance);
            }
          );
        }
      }
    )
    setShowModal(true);
  }

  useEffect(() => {
    getUserData();
    fetchMarketNFTs();
  }, [])
    return (
      <div className="App">
        <div style={{backgroundColor:"black", padding: 10}}>
        <div style={{fontSize:30,
           fontWeight: "bold",
            paddingLeft:5,
             marginTop:10
             }}
             >
              My Wallet
              </div>
        Address: {myAddress}
        <br/>
        <Alert
        onClick={getUserData}
         variant={"left"} 
         style= {{
          backgroundColor:"#f40075",
          fontSize:25}}
         >
          {myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "Connect your Wallet"}
          </Alert>
          {qrvalue !== "DEFAULT" ? (
          <Container style={{backgroundColor:'white',
          width:300,
          height:300,
          padding:20}}
          >
              <QRCode value={qrvalue} size={256} style={{margin : "auto"}}/>
        </Container>
          ): null}
        {/* Gallery */}
        {tab === 'MARKET' || tab === "WALLET" ? ( <div className='container' style={{padding:0, width:"100%"}}>
          {rows.map((o, rowIndex) => (
            <Row key={`rowkey${rowIndex}`}>
              <Col style={{marginRight: 0, paddingRight:0}}>
                <Card onClick= {()=>{
                  onClickCard(nfts[rowIndex*2].id);

                }
              }>
                <Card.Img src={nfts[rowIndex*2].uri} />
              </Card>
              [{nfts[rowIndex*2].id}]NFT
              </Col>
              <Col style={{marginRight: 0, paddingRight:0}}>
                {
                  nfts.length > rowIndex*2+1 ? (
                    <Card onClick= {()=>{
                      onClickCard(nfts[rowIndex*2+1].id);
    
                    }
                  }>
                    <Card.Img src={nfts[rowIndex*2+1].uri} />
                  </Card>
                  ) : null}
                  {nfts.length > rowIndex*2+1 ? (
                    <>[{nfts[rowIndex *2 +1].id}]NFT</>
                  ): null}
              </Col>
            </Row>
          ))}
        </div>):null}
        {/* Mint Page */}
        {tab === "MINT" ? (
        <div className='container' style={{padding:0, width:"100%"}}>
            <Card 
              className='text-center'
              style={{color:"black", height:"%50", borderColor:"#C58358"}}
              >
              <Card.Body style={{opacity:0.9 , backgroundColor: "black"}}>
                {mintImageUrl !== "" ? (
                <Card.Img src={mintImageUrl} height={"50%"}/>
                ): null}
                <Form>
                  <Form.Group>
                  <Form.Control
                    value={title}
                    onChange= {(e) =>{
                      console.log(e.target.value);
                      setTitle(e.target.value);
                    }}
                    type="text"
                    placeholder='Please write a title'
                    />
                    <br/>
                    <Form.Control
                    value={desc}
                    onChange= {(e) =>{
                      console.log(e.target.value);
                      setDesc(e.target.value);
                    }}
                    type="text"
                    placeholder='Please write a description'
                    />
                    <br/>
                    <Form.Control
                    value={mintImageUrl}
                    onChange= {(e) =>{
                      console.log(e.target.value);
                      setMintImageUrl(e.target.value);
                    }}
                    type="text"
                    placeholder='Please put any Image uri that you want to make NFT'
                    />
                    <br/>
                    <Form.Control
                    value={mintTokenID}
                    onChange= {(e) =>{
                      console.log(e.target.value);
                      setMintTokenID(e.target.value);
                    }}
                    type="text"
                    placeholder='Please write TokenID'
                    />
                  </Form.Group>
                  <br/>
                  <Button
                    onClick={() => {
                      onClickMint(title,desc,mintImageUrl, mintTokenID)
                    }
                  } 
                    variant='primary'
                    style={{backgroundColor:"#3EB489", borderColor:"#3EB489"
                  }}
                  >
                    Mint
                  </Button>
                </Form>
              </Card.Body>
            </Card>
        </div>) : null}
          
        </div>
        {/* Address, Account Balance */}
       
        {/* Tab */}
            <nav style={{backgroundColor:"#1b1717", height:45}} className="navBar fixed-bottm navbar-light" role="navigation">
              <Nav className="w-100">
              <div className='d-flex flex-row justify-content-around w-100'>
                  <div onClick={()=> {
                    setTab("MARKET");
                    fetchMarketNFTs();
                    console.log("MARKET")
                  }}
                  className="row d-flex flex-column justify-content-center align-items-center"
                  >
                    <div>
                      <FontAwesomeIcon color="white" size="lg" icon={faHome}/>
                    </div>
                  </div>
                  <div onClick={()=> {
                    setTab("MINT");
                    console.log("MINT")
                  }}
                  className="row d-flex flex-column justify-content-center align-items-center"
                  >
                    <div>
                    <FontAwesomeIcon color="white" size="lg" icon={faPlus}/>
                      </div>
                  </div>
                  <div onClick={(address)=> {
                    setTab("WALLET");
                    fetchMyNFTs(address);
                  }}
                  className="row d-flex flex-column justify-content-center align-items-center"
                  >
                    <div>
                    <FontAwesomeIcon color="white" size="lg" icon={faWallet}/>
                      </div>
                  </div>
                </div>
              </Nav>
            </nav>
            {/* Modal */}
            <Modal
            centered
            size="sm"
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
            >
              <Modal.Header style={{border:0, backgroundColor:"black",opacity:0.8}}>
                <Modal.Title>
              {modalProps.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Footer style={{border:0, backgroundColor:"black", opacity: 0.8}}>
                <Button variant="secondary" onClick={()=>{
                  setShowModal(false);}}
                  >
                        Close</Button>
                <Button
                variant='primary'
                onClick={()=>{
                  modalProps.onConfirm();
                  setShowModal(false);
                }}
                style={{backgroundColor:"#810034", borderColor:"#810034"}}>
                        Proceed</Button>
              </Modal.Footer>
            </Modal>

        
        
    </div>
  );
}

export default App;
