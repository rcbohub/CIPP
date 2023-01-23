import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { faEdit, faEllipsisV, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { cellBooleanFormatter, CellTip } from 'src/components/tables'
import { CippPageList } from 'src/components/layout'
import { TitleButton } from 'src/components/buttons'
import { CippActionsOffcanvas } from 'src/components/utilities'

const Offcanvas = (row, rowIndex, formatExtraData) => {
  const tenant = useSelector((state) => state.app.currentTenant)
  const [ocVisible, setOCVisible] = useState(false)
  const editLink = `/identity/administration/groups/edit?groupId=${row.id}&tenantDomain=${tenant.defaultDomainName}`
  return (
    <>
      <Link to={editLink}>
        <CButton size="sm" variant="ghost" color="warning">
          <FontAwesomeIcon icon={faEdit} />
        </CButton>
      </Link>
      <CButton size="sm" color="link" onClick={() => setOCVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </CButton>
      <CippActionsOffcanvas
        title="Group Information"
        extendedInfo={[
          { label: 'Created Date (UTC)', value: `${row.createdDateTime ?? ' '}` },
          { label: 'Group Type', value: `${row.calculatedGroupType ?? ' '}` },
          { label: 'OnPrem Last Sync', value: `${row.onPremisesLastSyncDateTime ?? ' '}` },
          { label: 'Unique ID', value: `${row.id ?? ' '}` },
        ]}
        actions={[
          {
            icon: <FontAwesomeIcon icon={faEdit} className="me-2" />,
            label: 'Edit Group',
            link: editLink,
            color: 'info',
          },
          {
            label: 'Test Menu Item 1',
            link: `/identity/administration/ViewBec?userId=${row.id}&tenantDomain=${tenant.defaultDomainName}`,
            color: 'info',
          },
          {
            label: 'Test Menu Item 2',
            color: 'info',
            modal: true,
            modalUrl: `/api/ExecCreateTAP?TenantFilter=${tenant.defaultDomainName}&ID=${row.userPrincipalName}`,
            modalMessage: 'Are you sure you want to create a Temporary Access Pass?',
          },
        ]}
        placement="end"
        visible={ocVisible}
        id={row.id}
        hideFunction={() => setOCVisible(false)}
      />
    </>
  )
}

const columns = [
  {
    name: 'Name',
    selector: (row) => row['displayName'],
    sortable: true,
    cell: (row) => CellTip(row['displayName']),
    exportSelector: 'displayName',
    grow: 2,
  },
  {
    name: 'Group Type',
    selector: (row) => row['calculatedGroupType'],
    sortable: true,
    exportSelector: 'calculatedGroupType',
    cell: (row) => CellTip(row['calculatedGroupType']),
    minWidth: '165px',
  },
  {
    name: 'Dynamic Group',
    selector: (row) => row['dynamicGroupBool'],
    cell: cellBooleanFormatter({ colourless: true }),
    sortable: true,
    exportSelector: 'dynamicGroupBool',
    minWidth: '145px',
  },
  {
    name: 'Teams Enabled',
    selector: (row) => row['teamsEnabled'],
    sortable: true,
    cell: cellBooleanFormatter({ colourless: true }),
    exportSelector: 'teamsEnabled',
    minWidth: '140px',
  },
  {
    name: 'On-Prem Sync',
    selector: (row) => row['onPremisesSyncEnabled'],
    sortable: true,
    cell: cellBooleanFormatter({ colourless: true }),
    exportSelector: 'onPremisessSyncEnabled',
    minWidth: '140px',
  },
  {
    name: 'Email',
    selector: (row) => row['mail'],
    sortable: true,
    exportSelector: 'mail',
    cell: (row) => CellTip(row['mail']),
    grow: 2,
  },
  {
    name: 'Actions',
    cell: Offcanvas,
    maxWidth: '20px',
  },
]

const Groups = () => {
  const tenant = useSelector((state) => state.app.currentTenant)

  return (
    <CippPageList
      title="Groups"
      titleButton={<TitleButton href="/identity/administration/groups/add" title="Add Group" />}
      datatable={{
        reportName: `${tenant?.defaultDomainName}-Groups`,
        path: '/api/ListGroups',
        params: { TenantFilter: tenant?.defaultDomainName },
        columns,
        filterlist: [
          {
            filterName: 'Distribution Groups',
            filter: '"calculatedGroupType":"Distribution List"',
          },
          { filterName: 'Security Groups', filter: '"calculatedGroupType":"Security"' },
          { filterName: 'M365 Groups', filter: '"calculatedGroupType":"Microsoft 365"' },
          { filterName: 'Mail-Enabled Security Groups', filter: '"Mail-Enabled Security"' },
          { filterName: 'Dynamic Groups', filter: '"dynamicGroupBool":true' },
          { filterName: 'Teams Groups', filter: '"teamsEnabled":true' },
          { filterName: 'AAD Groups', filter: '"onPremisesSyncEnabled":null' },
          { filterName: 'Synced Groups', filter: '"onPremisesSyncEnabled":true' },
        ],
      }}
    />
  )
}

export default Groups
