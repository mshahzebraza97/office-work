// Dependency
import Image from 'next/image'
import React, { useState } from 'react'
import { removeDuplicate } from '../../helpers/reusable'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// Store & Styles
import styles from './MWOentryBar.module.scss';
import { mwoActions } from '../../store/mwo/mwo-slice'

// Components
import SummaryMWO_Modal from './SummaryMWO_Modal'
import UpdateMWO_Modal from './UpdateMWO_Modal'



export default function MWOentryBar({ mwoData, mwoIndex }) {

  const router = useRouter()
  const dispatch = useDispatch();

  const [showSummary, setShowSummary] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);


  return (

    <li className={styles.entry} >


      {/* Serial */}
      <span className={styles.entryIndex}>{mwoIndex}</span>
      {/* MWO ID */}
      <span className={styles.entryMWOid}>{mwoData.mwoId}</span>

      {/* MWO Type */}
      <span className={styles.entryItemName}>{mwoData.itemName}</span>


      {/* PO Items */}
      <span className={styles.entryQty}>
        {
          mwoData.qty
        }
      </span>

      <span className={styles.entryApplication}>
        {mwoData.application}
      </span>

      {/* PO Status */}
      <span className={styles.entryStatus}>
        <span className={`${styles.entryStatusIcon} ${styles[`entryStatusIcon-${mwoData.status.trim().toLowerCase().replace(/\s+/g, '')}`]}`} />
        <span className={styles.entryStatusText} >{mwoData.status}</span>
      </span>

      {/* PO Commands */}
      <div className={styles.entryControls}>
        <EntryCtrlBtn type={'Edit'} click={() => setShowUpdateForm(true)} ></EntryCtrlBtn>
        {showUpdateForm && <UpdateMWO_Modal closer={() => setShowUpdateForm(false)} mwoData={mwoData} />}

        <EntryCtrlBtn type={'Summary'} click={() => setShowSummary(true)} ></EntryCtrlBtn>
        {showSummary && <SummaryMWO_Modal closer={() => setShowSummary(false)} mwoData={mwoData} />}
        {/* itemList={refinedItemList} */}

        <EntryCtrlBtn type={'Detail'} click={() => router.push(`mwo/${mwoData.mwoId}`)} ></EntryCtrlBtn>

        <EntryCtrlBtn type={'Delete'} click={() => dispatch(poActions.deletePO(mwoData.refId))} ></EntryCtrlBtn>
      </div>
    </li>
  )
}


// Edit,Summary,Detail,Delete
function EntryCtrlBtn(props) { // Pass the `TYPE` in sentence case
  // console.log('props', props);
  // console.log(props.type.toLowerCase());

  return (
    <button
      className={`${styles[`entryControls${props.type}`]} ${`tooltip`}`}
      onClick={props.click}
    >
      <Image
        src={`/icons/${props.type}.png`}
        alt={props.type}
        width={20}
        height={20} />
      <span className={`tooltipContent`}>{props.type}</span>
    </button>
  )
}
