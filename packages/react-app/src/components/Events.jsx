import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";
const { ethers } = require("ethers");

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
console.log(events)

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
      <List
        bordered
        dataSource={events}

        renderItem={item => {
          return (
            <List.Item key={item.args[2] + "_" + item.BlockNumber + "_" + item.transactionHash}>
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              {item.event} {Number(item.args[2]._hex)/10**18} Your token from FTM --> BSC
            </List.Item>

          );
        }}
      />
    </div>
  );
}
