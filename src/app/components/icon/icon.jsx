export default function Icon({dataIcon, classes}) {
    return (<span class={`iconify ${classes}`} data-icon={dataIcon} data-inline="false"></span>);
}