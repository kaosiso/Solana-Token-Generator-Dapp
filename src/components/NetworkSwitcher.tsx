import { FC } from "react";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } =
    useNetworkConfiguration();

  return (
    <select
      value={networkConfiguration}
      onChange={(e) => setNetworkConfiguration(e.target.value || "devnet")}
      className="
        bg-blue-900
        border-none
        outline-none
        cursor-pointer
        rounded-md

        px-3 py-1
        text-base font-semibold capitalize

        text-default-100
        transition-colors duration-300
        hover:text-primary
        focus:text-primary

        lg:text-white
      "
    >
      <option value="mainnet-beta">main</option>
      <option value="devnet">dev</option>
      <option value="testnet">test</option>
    </select>
  );
};

export default NetworkSwitcher;
