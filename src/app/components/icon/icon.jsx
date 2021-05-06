export default function Icon({dataIcon, classes}) {
    return (<span className={`iconify ${classes?classes:""}`} data-icon={dataIcon} data-inline="false"></span>);
}