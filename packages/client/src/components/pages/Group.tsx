import React, { useEffect, useMemo, useState } from "react";
import { IoChevronBackOutline, IoEllipsisVertical, IoPeopleCircleOutline, IoSettingsSharp } from "react-icons/io5";
import { Link, Outlet, useParams } from "react-router-dom";
import IconedButton from "../shared/IconedButton";
import DoubleSidebared, {DoubleSidebaredProps} from "../layouts/DoubleSidebared";
import { useMediaQuery } from "react-responsive";
import Header from "../shared/Header";
import UserItemMember from "../shared/UserItemMember";
import IntegratedMenu from "../layouts/IntegratedMenu";
import { ChannelPostData, GroupPostData } from "@ordinem-megachat-2022/shared";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useGroupDetailsQuery } from "../../features/groups/groupsService";
import { useGroupMembersQuery } from "../../features/users/usersService";
import { useAppSelector } from "../../store/utils/hooks";
import { selectUsersData } from "../../features/users/usersDataSlice";
import { has, pick } from "lodash";
import useRealtimeSystemEmitter from "../../features/realtimeSystem/useRealtimeSystemEmitter";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import NavLinkWithOptions from "../shared/NavLinkWithOptions";
import CreateChannelModal from "../features/channels/CreateChannelModal";
import EditChannelModal from "../features/channels/EditChannelModal";
import EditGroupModal from "../features/groups/EditGroupModal";


const Group: React.FC = () => {

  // #region Состояние представления
  
  // состояние лэйаута
  const isMdScreen = useMediaQuery({ query: '(min-width: 768px)' });
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

  const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState<boolean>(false);
  const handleEditChannelModalClose = () => {
    setIsEditChannelModalOpen(false);
  }

  // #endregion
  
  
  // #region данные группы (Сама группа и участники)
  const { groupId } = useParams();
  const { 
    isLoading: isGroupDataLoading,
    data: groupData
  } = useGroupDetailsQuery(groupId || '');

  const [editGroup, setEditGroup] = useState<Partial<GroupPostData & { uuid: string; avaUuid: string }>>({});
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState<boolean>(false);

  const handleGroupModalOpen = () => {
    setEditGroup(pick(groupData, ['uuid', 'name', 'description', 'avaPath', 'avaUuid']));
    setIsEditGroupModalOpen(true);
  }

  const handleGroupModalClose = () => {
    setIsEditGroupModalOpen(false);
  }
  // #endregion


  // #region Пользователь
  const currentUser = useSelector(selectCurrentUser);

  const isOwner = useMemo(() => {
    return groupData?.owner.uuid === currentUser.uuid;
  }, [groupData, currentUser]);
  // #endregion

  // #region Участники канала
  const {
    isLoading: isGroupMembersLoading,
    data: groupMembers
  } = useGroupMembersQuery(groupId || '');
  // #endregion
  
  // #region каналы

  // редактирование канала
  const [editChannel, setEditChannel] = useState<Partial<ChannelPostData & { uuid: string }>>({});

  const handleOpenChannelSettings = (channelUuid: string) => {
    const channelData = groupData?.channels.find(item => item.uuid === channelUuid);
    setEditChannel({
      uuid: channelData?.uuid,
      name: channelData?.name, 
      description: channelData?.description, 
    });
    setIsEditChannelModalOpen(true);
  }

  const {
    subscribeToChanges, unsubscibeToChanges
  } = useRealtimeSystemEmitter();

  //#endregion

  // #region статусы участников 
  useEffect(() => {

    if (!(groupData && groupMembers && groupId && !!subscribeToChanges && !!unsubscibeToChanges)) return;
    // запрашиваем статусы участников и владельца

    subscribeToChanges({
      groups: [groupId],
      users: groupMembers.map(item => item.uuid).concat(groupData.owner.uuid),
      channels: groupData.channels.map(item => item.uuid) 
    })

    return () => {
      unsubscibeToChanges({
        groups: [groupId],
        users: groupMembers.map(item => item.uuid).concat(groupData.owner.uuid),
        channels: groupData.channels.map(item => item.uuid) 
      })
    }
    
  }, [groupMembers, groupData, groupId, subscribeToChanges, unsubscibeToChanges]);

  const usersData = useAppSelector(selectUsersData);
  // #endregion

  return (<>
    {/* модалка для добавления нового канала */}
    <CreateChannelModal 
      groupUuid={groupId} 
      isOpen={isCreateChannelModalOpen}
      onClose={handleCreateChannelModalClose} 
    />
    {/* модалка для изменеия канала */}
    <EditChannelModal 
      groupUuid={groupId}
      isOpen={isEditChannelModalOpen}
      onClose={handleEditChannelModalClose}
      channelData={editChannel}
    />
    {/* модалка для изменения данных группы */}
    <EditGroupModal 
      groupData={editGroup}
      isOpen={isEditGroupModalOpen}
      onClose={handleGroupModalClose}
      onSuccess={handleGroupModalClose}
      onFail={() => {console.log('EditGroupModal. Somethong gone wrong')}}
    />

    {/* страница */}
    <div className="h-screen w-screen flex flex-col">
      {/* Заголовок */}
      <Header 
        title={!isGroupDataLoading ? groupData?.name || 'ошибка' : 'загрузка...'} 
        afterTitleContent={
          isOwner && (
            <div className="hover:text-textPrimary text-textSecondary transition-colors duration-75">
              <IconedButton icon={IoSettingsSharp} onClick={handleGroupModalOpen} />
            </div>
          )
        }
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

      {/* Основная страница */}
      <DoubleSidebared
        layoutState={layoutState}
        // левый сайдбар - каналы группы
        leftSidebarContent={
          <div className="bg-bglighten rounded-lg h-full w-full">
            <div className="py-4 pl-4 pr-3 flex relative">
              <h1 className="text-textSecondary grow">Каналы группы</h1>
              {isOwner && (
                <IconedButton 
                  icon={IoEllipsisVertical} 
                  onClick={handleChannelsOptions}
                  size='1.5rem'
                />
              )}
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
            <div className="flex flex-col space-y-1 items-stretch">
              {isGroupDataLoading
              ? (
                <div className="flex space-x-2 p-4 text-textSecondary">
                  <LoadingSpinner size='1.5rem' />
                  <span>загрузка...</span>
                </div>
              )
              : (
                  groupData?.channels.map(({uuid, name}: any) =>
                    <div key={uuid} 
                      className="group flex w-full hover:bg-glassy"
                    >
                      <NavLinkWithOptions 
                        onLongPress={() => (!isMdScreen && isOwner) && handleOpenChannelSettings(uuid)}
                        className={({ isActive }) => {
                          return isActive
                            ? `px-4 py-2 grow block truncate text-textPrimary font-medium`
                            : `px-4 py-2 grow block truncate text-textSecondary font-medium`
                        }}
                        key={uuid} link={uuid}
                      >
                        {name}
                      </NavLinkWithOptions>
                      {
                        isOwner && (
                          <button 
                            onClick={() => handleOpenChannelSettings(uuid)}
                            className="md:group-hover:flex p-2 pr-4 cursor-pointer hidden justify-center items-center text-textSecondary hover:text-textPrimary"
                          >
                            <IoSettingsSharp size={'1rem'} />
                          </button>
                        )
                      }
                    </div>
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
              {
                (!isGroupDataLoading)
                  ? groupData && (
                    <UserItemMember
                      key={groupData.owner.uuid}
                      {...groupData.owner}
                      status={
                        has(usersData, groupData.owner.uuid)
                        ? usersData[groupData.owner.uuid].status
                        : 'не в сети'
                      } 
                    />
                  )
                  : <div>загрузка...</div>
              }
                
              {
                (!isGroupMembersLoading)
                  ? groupMembers?.map(({uuid, name, avaPath}) => 
                    <UserItemMember 
                      key={uuid}
                      uuid={uuid}
                      avaPath={avaPath}
                      name={name}
                      status={
                        has(usersData, uuid)
                          ? usersData[uuid].status
                          : 'не в сети'
                      } 
                    />
                  )
                  : <div>загрузка...</div>
              }
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