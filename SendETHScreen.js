import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Web3 from 'web3';

const sendEth = async (toAddress, value) => {
  const web3 = new Web3('HTTP://127.0.0.1:7545');
  const privateKey = '0xb6c9a5f08a2e785fae8eed91656e17961d7cc05aaf349cdd612514361ab1d8af';

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const gasPrice = '20000000000'; // Setting the gas price here
  const txCount = await web3.eth.getTransactionCount(account.address);
  const txObject = {
    nonce: web3.utils.toHex(txCount),
    to: toAddress,
    value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(gasPrice)
  };
  const signedTx = await account.signTransaction(txObject);
  web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', (hash) => {
      console.log(`Transaction hash: ${hash}`);
      setStatus('Pending');
    })
    .on('receipt', (receipt) => {
      console.log(`Transaction receipt: ${receipt}`);
      setStatus('Completed');
    })
    .on('error', (error) => {
      console.error(`Error: ${error}`);
      setStatus('Error');
    });
};

const MyScreen = () => {
  const [toAddress, setToAddress] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');

  const handlePress = () => {
    sendEth(toAddress, value);
  };

  return (
    <View style={{ marginHorizontal: 20, marginVertical: 40 }}>
      <TextInput
        placeholder="To address"
        value={toAddress}
        onChangeText={setToAddress}
        style={{ marginBottom: 20 }}
      />
      <TextInput
        placeholder="Value"
        value={value}
        onChangeText={setValue}
        style={{ marginBottom: 20 }}
      />
      <Button
        title="Submit"
        onPress={handlePress}
      />
      <Text>{`Status: ${status}`}</Text>
    </View>
  );
};

export default MyScreen;
