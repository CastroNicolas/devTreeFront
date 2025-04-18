import { DevTreeLink } from "../types";
import { Switch } from "@headlessui/react";
import { classNames } from "../utils";

type DevTreeInputProps = {
  item: DevTreeLink;
  handleURLChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableLink: (socialNetwork: string) => void;
};

export const DevTreeInput = ({
  item,
  handleURLChange,
  handleEnableLink,
}: DevTreeInputProps) => {
  return (
    <div className="bj-white shadow-sm p-5 flex items-centetr gap-2">
      <div
        className="min-w-[32px] min-h-[32px] max-w-[48px] max-h-[48px] w-[10vw] h-[10vw] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
      ></div>
      <input
        type="text"
        className=" flex-1 border border-gray-300 rounded-lg"
        value={item.url}
        onChange={handleURLChange}
        name={item.name}
      />
      <Switch
        checked={item.enabled}
        onChange={() => handleEnableLink(item.name)}
        className={classNames(
          item.enabled ? "bg-blue-500" : "bg-gray-600",
          "relative inline-flex h-6 w-11 mt-2.5 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            item.enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </div>
  );
};
