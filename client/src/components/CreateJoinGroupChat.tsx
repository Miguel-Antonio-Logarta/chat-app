import React from 'react'
import { MdClose } from 'react-icons/md';
import Modal from './Modal'

type Props = {
    showSelf: any;
}

const CreateJoinGroupChat = ({showSelf}: Props) => {
    const handleOnClose = (e: React.MouseEvent) => {
        e.preventDefault();
        showSelf(false);
    }

  return (
    <Modal onClose={handleOnClose}>
        <div className='add-group-chat' onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={handleOnClose} className="close">
                <MdClose />
            </button>
            <h2 className='thin-yellow-font'>Add a Group Chat</h2>
            <div></div>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className='thin-yellow-font'>Send a Friend Request</h2>
                <p>Add a friend by entering their User ID</p>
                <div className='modal-input'>
                    <input autoComplete='off' placeholder='User ID' {...register("userId", {required: true})}/>
                    <button>Send</button>
                </div>
            </form> */}
        </div>
    </Modal>
  )
}

export default CreateJoinGroupChat