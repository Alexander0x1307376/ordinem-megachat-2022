import React, { FormEvent, useEffect, useRef, useState } from "react";
import { IoChevronBackOutline, IoClose, IoEllipsisVertical, IoPeopleCircleOutline } from "react-icons/io5";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import IconedButton from "../shared/IconedButton";
import DoubleSidebared, {DoubleSidebaredProps} from "../layouts/DoubleSidebared";
import { useMediaQuery } from "react-responsive";
import Header from "../shared/Header";
import { useGroupDetailsQuery, useUserGroupsQuery } from "../../store/services/groupsService";
import Button from "../shared/Button";
import UserItemMember from "../shared/UserItemMember";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import useOutsideClickHandler from "../../utils/useOutsideClickHandler";
import IntegratedMenu from "../layouts/IntegratedMenu";
import FramerModal from "../shared/FramerModal";
import ModalWindow from "../layouts/ModalWindow";
import CreateChannelForm from "../forms/CreateChannelForm";
import { useChannelListQuery, useCreateChannelMutation } from "../../store/services/channelsService";
import { ChannelPostData } from "@ordinem-megachat-2022/shared";
import LoadingSpinner from "../shared/LoadingSpinner";

const channels = [
  {
    uuid: '111',
    name: 'главный'
  },
  {
    uuid: '222',
    name: 'мемчат'
  },
  {
    uuid: '333',
    name: 'второстепенный'
  },
  {
    uuid: '444',
    name: 'канал с очень-очень длинным названием'
  },
];

const users = [
  {
    uuid: '111',
    name: 'Vasya',
  },
  {
    uuid: '222',
    name: 'Петя Иваович',
    avaPath: 'https://i.pravatar.cc/150?img=7'
  },
  {
    uuid: '333',
    name: 'Человек с очень-очень длинным ником, настолько же длинным, насколько же и бессмысленным',
    avaPath: 'https://i.pravatar.cc/150?img=8'
  },
]


const Group: React.FC = () => {

  const isMdScreen = useMediaQuery({ query: '(min-width: 768px)' });
  
  // #region Состояние представления

  // состояние лэйаута
  const [
    layoutState, setLayoutState
  ] = useState<DoubleSidebaredProps['layoutState']>(isMdScreen ? 'rightIsOpen' : 'init');
  const [lastTouched, setLastTouched] = useState<'left' | 'right' | undefined>('right');
  const handleLeftButtonClick = () => {
    setLastTouched('left');

    if(layoutState === 'init') 
      setLayoutState('leftIsOpen');

    if(layoutState === 'leftIsOpen') 
      setLayoutState('init');

    if(layoutState === 'rightIsOpen')
      setLayoutState(isMdScreen ? 'bothAreOpen' : 'leftIsOpen');

    if (layoutState === 'bothAreOpen')
      setLayoutState(isMdScreen ? 'rightIsOpen' : 'init');
    
  };
  const handleRightButtonClick = () => {
    setLastTouched('right');

    if(layoutState === 'init')
      setLayoutState('rightIsOpen');

    if(layoutState === 'rightIsOpen')
      setLayoutState('init');

    if(layoutState === 'leftIsOpen')
      setLayoutState(isMdScreen ? 'bothAreOpen' : 'rightIsOpen');

    if(layoutState === 'bothAreOpen')
      setLayoutState(isMdScreen ? 'leftIsOpen' : 'init');

  };

  useEffect(() => {
    if(!isMdScreen && layoutState === 'bothAreOpen') {
      if(lastTouched === 'left') 
        setLayoutState('leftIsOpen');
      else 
        setLayoutState('rightIsOpen');
    }
  }, [isMdScreen, lastTouched, layoutState]);


  // состояние мелких менюх

  const [isChannelsOptionsOpen, setIsChannelsOptionsOpen] = useState<boolean>(false);
  const handleChannelsOptions = () => setIsChannelsOptionsOpen(!isChannelsOptionsOpen);
  const handleCloseChannelsOptions = () => setIsChannelsOptionsOpen(false);
    
  const [isMembersOptionsOpen, setIsMembersOptionsOpen] = useState<boolean>(false);
  const handleMembersOptions = () => setIsMembersOptionsOpen(!isChannelsOptionsOpen);
  const handleCloseMembersOptions = () => setIsMembersOptionsOpen(false);

  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState<boolean>(false);
  const handleCreateChannelModalClose = () => {
    setIsCreateChannelModalOpen(false);
  }

  // #endregion


  // #region группы
  const { groupId } = useParams();
  const { data: groupData, isLoading: isGroupDataLoading } = useGroupDetailsQuery(groupId);
  // #endregion


  // #region каналы

  // создание каналов
  const [createChannel, {isLoading: createChannelLoading}] = useCreateChannelMutation();
  const handleSubmitCreateChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    try {
      const postData: ChannelPostData = {
        ...Object.fromEntries(data) as Pick<ChannelPostData, 'name' | 'description'>,
        groupUuid: groupId!
      };
      const result = await createChannel(postData).unwrap();
      (event.target as any).reset();
      handleCreateChannelModalClose();
    } catch (e) {

    }
  }

  // список каналов
  const { data: channelList, isLoading: ischannelListLoading} = useChannelListQuery(groupId!);


  // #endregion

  return (<>
    <FramerModal isOpen={isCreateChannelModalOpen} onOutlineClick={handleCreateChannelModalClose}>
      <ModalWindow
        isAutoSize
        onClose={handleCreateChannelModalClose}
        title="Добавить канал"
      >
        <div className="h-full md:h-[calc(100vh-10rem)] md:w-[30rem] overflow-y-auto">
          <CreateChannelForm onSubmit={handleSubmitCreateChannel} />
        </div>
      </ModalWindow>
    </FramerModal>
    <div className="h-screen w-screen flex flex-col">
      <Header title={groupData?.name || 'загрузка...'} 
        leftContent={
          <Link className="p-2" to='/groups'><IoChevronBackOutline size="1.5rem" /></Link>  
        }
        rightContent={<>
          <div
            className={
              (layoutState === 'leftIsOpen' || layoutState === 'bothAreOpen')
                ? "mr-4 text-textPrimary transition-colors duration-75"
                : "mr-4 text-textSecondary transition-colors duration-75"
            }
          >
            <IconedButton
              icon={IoEllipsisVertical}
              onClick={handleLeftButtonClick}
            />
          </div>

          <div
            className={
              (layoutState === 'rightIsOpen' || layoutState === 'bothAreOpen')
                ? "text-textPrimary transition-colors duration-75"
                : "text-textSecondary transition-colors duration-75"
            }
          >
            <IconedButton
              icon={IoPeopleCircleOutline}
              onClick={handleRightButtonClick}
            />
          </div>
        </>}
      />

      <DoubleSidebared
        layoutState={layoutState}
        // левый сайдбар - каналы группы
        leftSidebarContent={
          <div className="bg-bglighten rounded-lg h-full w-full">
            <div className="py-4 pl-4 pr-3 flex relative">
              <h1 className="text-textSecondary grow">Каналы группы</h1>
              <IconedButton 
                icon={IoEllipsisVertical} 
                onClick={handleChannelsOptions}
                size='1.5rem'
              />
              {/* опции каналов */}
              <IntegratedMenu 
                isMenuOpen={isChannelsOptionsOpen} 
                onCloseClick={handleCloseChannelsOptions}
                onOutsideClick={handleCloseChannelsOptions}
              >
                <button 
                  className="bg-glassy py-1.5 px-2 text-left rounded-md truncate"
                  onClick={() => setIsCreateChannelModalOpen(true)} 
                >
                  добавить канал
                </button>
              </IntegratedMenu>
            </div>
            <div className="flex flex-col space-y-1">
              {ischannelListLoading
              ? (
                <div className="flex space-x-2 p-4 text-textSecondary">
                  <LoadingSpinner size='1.5rem' />
                  <span>загрузка...</span>
                </div>
              )
              : (
                channelList!.channels.map(({uuid, name}) =>
                <NavLink
                  className={({ isActive }) => {
                    return isActive
                      ? `py-2 px-4 hover:bg-glassydarken transition
                        duration-100 truncate text-textPrimary font-medium`
                      : `py-2 px-4 hover:bg-glassy transition 
                        duration-100 truncate text-textSecondary font-medium`
                  }}
                  key={uuid} to={uuid}
                >
                  {name}
                </NavLink>
              )
              )}
              
            </div>
          </div>
        }
        // правый сайдбар - участники
        rightSidebarContent={
          <div
            className="rounded-lg bg-bglighten h-full"
          >
            <div className="py-4 pl-4 pr-3 flex relative">
              <h1 className="text-textSecondary grow">Участники</h1>
              <IconedButton
                icon={IoEllipsisVertical}
                onClick={handleMembersOptions}
                size='1.5rem'
              />
              {/* опции каналов */}
              <IntegratedMenu
                isMenuOpen={isMembersOptionsOpen}
                onCloseClick={handleCloseMembersOptions}
                onOutsideClick={handleCloseMembersOptions}
              >
                <button className="bg-glassy py-1.5 px-2 text-left rounded-md truncate">
                  управление участниками
                </button>
                <button className="bg-glassy py-1.5 px-2 text-left rounded-md truncate">
                  управление участниками
                </button>
              </IntegratedMenu>
            </div>
            <div className="flex flex-col space-y-1 pl-2">
              {users.map(({uuid, name, avaPath}) => 
                <UserItemMember 
                  key={uuid}
                  uuid={uuid}
                  avaPath={avaPath}
                  name={name}
                  status={'в сети'} 
                />
              )}
            </div>
          </div>
        }
        onOutlineClick={() => setLayoutState('init') }
      >
        {/* центральная часть */}
        <div className="rounded-lg bg-bglighten h-full w-full">
          <Outlet />
        </div>
      </DoubleSidebared>

      
    </div>
  </>)
}

export default Group;