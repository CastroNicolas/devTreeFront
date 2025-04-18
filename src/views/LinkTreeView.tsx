import { useEffect, useState } from "react";
import { social } from "../data/social";
import { DevTreeInput } from "../components/DevTreeInput";
import { isValidURL, validateSocialUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import { SocialNetwork, User } from "../types";

export const LinkTreeView = () => {
  const [devTreeLinks, setDevTreeLinks] = useState(social);
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(["user"])!;
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      );
      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled };
      }
      return item;
    });
    setDevTreeLinks(updatedData);
  }, []);
  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) => {
      // Actualizar solo el enlace que ha cambiado
      if (link.name === e.target.name) {
        if (!e.target.value) {
          toast.error("URL is empty!");
          if (link.enabled) {
            handleEnableLink(e.target.name);
          }
          return { ...link, url: e.target.value, enabled: false };
        }
        if (
          isValidURL(e.target.value) &&
          !validateSocialUrl(e.target.value, link.name)
        ) {
          toast.error(`Invalid ${link.name} URL format!`);
          return { ...link, url: e.target.value, enabled: false };
        }
        toast.success("URL saved successfully!");
        return { ...link, url: e.target.value };
      }
      return link;
    });
    setDevTreeLinks(updatedLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);
  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((item) => {
      if (item.name === socialNetwork) {
        if (isValidURL(item.url) && validateSocialUrl(item.url, item.name)) {
          toast.success(item.enabled ? "Disabled link" : "Enabled link");
          return { ...item, enabled: !item.enabled };
        } else {
          toast.error("URL is not valid!");
          return { ...item, enabled: false };
        }
      }
      return item;
    });

    let updatedItems: SocialNetwork[] = [];
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork
    );

    if (selectedSocialNetwork?.enabled) {
      // Enabling the link
      const id = (links.filter((link) => link.enabled).length + 1).toString();

      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) =>
          link.name === socialNetwork ? { ...link, enabled: true, id } : link
        );
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id,
        };
        updatedItems = [...links, newItem];
      }
    } else {
      // Disabling the link
      const indexToDisable = links.findIndex(
        (link) => link.name === socialNetwork
      );

      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return { ...link, id: "0", enabled: false };
        } else if (link.id > links[indexToDisable].id) {
          return { ...link, id: (parseInt(link.id) - 1).toString() }; // Adjust indices
        } else {
          return link;
        }
      });
    }

    setDevTreeLinks(updatedLinks);

    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems),
      };
    });
  };
  return (
    <div>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleURLChange={handleURLChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
      </div>
      <button
        onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold cursor-pointer"
      >
        Save changes
      </button>
    </div>
  );
};
