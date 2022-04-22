import React, { useMemo, useState } from "react";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import Ava from "../shared/Ava";
import { BASE_API_URL } from "../../config/server";
import { IoEllipsisVertical, IoExitOutline, IoPersonCircle } from "react-icons/io5";
import PopoverMenuOptions from "../shared/PopoverMenuOptions";
import IconedButton from "../shared/IconedButton";
import { motion, AnimatePresence } from "framer-motion";
import { Popover } from "react-tiny-popover";
import { useNavigate } from "react-router-dom";

const AccountWidget: React.FC = () => {

  const user = useMemo(getUserFromLocalStorage, []);

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const options = [
    {
      key: 'leaveAccount',
      title: 'Выйти из учётной записи',
      icon: IoExitOutline,
      onClick: () => {
        navigate('/logout');
      }
    }
  ];


  return (<>
    {
      user
      ? (
        <div className="rounded-lg bg-glassy w-full p-4 flex items-center">
          {
            user.userData.avaUrl
            ? <Ava imageUrl={BASE_API_URL + user?.userData.avaUrl} />
            : <IoPersonCircle className="h-10 w-10" />
          }
          <p className="mx-4 grow">{user?.userData.name}</p>
          <span className="mx-4">в сети</span>
          <div>
            <AnimatePresence>
              <Popover
                isOpen={isPopoverOpen}
                positions={['left', 'top', 'bottom', 'right']}
                content={

                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .2 }}
                  >
                    <PopoverMenuOptions options={options} />
                  </motion.div>

                }
                align='start'
                onClickOutside={() => setIsPopoverOpen(false)}
              >
                <div>
                  <IconedButton
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    icon={IoEllipsisVertical}
                  />
                </div>
              </Popover>
            </AnimatePresence>
          </div>
        </div>
      )
      : (
        <div className="rounded-lg bg-glassy w-full p-4 flex items-center">
          не залогинен
        </div>
      )
    }
  </>)
}

export default AccountWidget;