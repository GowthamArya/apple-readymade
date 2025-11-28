import { TbFilterSearch } from "react-icons/tb";
import { BiSort } from "react-icons/bi";

export const uiData = [
    {
        icon: TbFilterSearch,
        label: 'Filters',
        showBgOnClick: true,
        key: 'filter',
    },
    {
        icon: BiSort,
        label: 'Sort',
        showBgOnClick: true,
        onclick: () => { },
        key: 'sort',
    }
];
