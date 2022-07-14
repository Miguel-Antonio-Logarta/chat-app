import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import Modal from './Modal';

type Props = {
    showSelf: any;
}

type FriendForm = {
    userId: number;
}

const AddFriend = ({showSelf}: Props) => {
    const {register, handleSubmit} = useForm<FriendForm>();

    const onSubmit: SubmitHandler<FriendForm> = (data) => {
        console.log(data);
    }

    const handleOnClose = (e: React.MouseEvent) => {
        console.log("I'm being closed");
        e.preventDefault();
        showSelf(false);
    }
    
  return (
    <Modal onClose={handleOnClose}>
        <div className='add-friend' onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={handleOnClose} className="close">
                <MdClose />
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className='thin-yellow-font'>Send a Friend Request</h2>
                <p>Add a friend by entering their User ID</p>
                <div className='modal-input'>
                    <input autoComplete='off' placeholder='User ID' {...register("userId", {required: true})}/>
                    <button>Send</button>
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default AddFriend