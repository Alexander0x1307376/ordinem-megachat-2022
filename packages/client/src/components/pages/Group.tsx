import React, { useEffect, useState } from "react";
import { IoChevronBackOutline, IoEllipsisVertical, IoPeopleCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import IconedButton from "../shared/IconedButton";
import DoubleSidebared, {DoubleSidebaredProps} from "../layouts/DoubleSidebared";
import { useMediaQuery } from "react-responsive";
import Header from "../shared/Header";
// import { io } from 'socket.io-client';
// import useGroupChat from "../../hooks/useGroupChat";

const Group: React.FC = () => {


  // const chateg = useGroupChat();


  // const { groupId } = useParams();

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

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header title="Группа 12" 
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
        leftSidebarContent={
          <div className="bg-bglighten2 rounded-lg h-full w-full p-4">
            Левый сайдбар
          </div>
        }
        rightSidebarContent={
          <div
            className="rounded-lg bg-bglighten2 h-full p-4"
          >
            <div>Сайдбар</div>
            <div>Atata 1</div>
            <div>Atata 2</div>
            <div>Atata 3</div>
          </div>
        }
        onOutlineClick={() => setLayoutState('init') }
      >
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          Основная часть
        </div>
      </DoubleSidebared>

      
    </div>
  )
}

export default Group;