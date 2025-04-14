import NavigationTabs from "./nav/NavigationTabs";
import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SocialNetwork, User } from "../types";
import { useEffect, useState } from "react";
import { DevTreeLink } from "./DevTreeLink";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "./Header";
type DevTreeProps = {
  data: User;
};

export const DevTree = ({ data }: DevTreeProps) => {
  const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(
    JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
  );
  const queryClient = useQueryClient();
  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (over && over.id) {
      const prevIndex = enabledLinks.findIndex((link) => link.id === active.id);
      const nextIndex = enabledLinks.findIndex((link) => link.id === over.id);
      const newOrder = arrayMove(enabledLinks, prevIndex, nextIndex);
      setEnabledLinks(newOrder);
      const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter(
        (item: SocialNetwork) => !item.enabled
      );

      const links = newOrder.concat(disabledLinks);
      queryClient.setQueryData(["user"], (prevData: User) => {
        return { ...prevData, links: JSON.stringify(links) };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
        delay: 0,
        tolerance: 0,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setEnabledLinks(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    );
  }, [data]);
  return (
    <>
      <Header />
      <div className="bg-gray-100  min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visit My Profile: /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-white text-4xl text-center">{data.handle}</p>

              {data.image && (
                <img
                  src={data.image}
                  alt="Profile Image"
                  className="mx-auto max-w-[250px]"
                />
              )}
              <p className="text-white text-lg text-center font-black">
                {data.description}
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="mt-20 flex flex-col gap-5">
                  <SortableContext
                    items={enabledLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enabledLinks.map((link) => (
                      <DevTreeLink key={link.name} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
};
