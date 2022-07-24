import Multiselect from "multiselect-react-dropdown";


export const resetSelectedValues = (positionsMultiSelectRef: React.RefObject<Multiselect>, jobTitlesMultiSelectRef: React.RefObject<Multiselect>) => {
    // console.log(positionsMultiSelectRef?.current?.getSelectedItems());
    // console.log(positionsMultiSelectRef?.current?.getSelectedItemsCount());

    positionsMultiSelectRef?.current?.resetSelectedValues();
    jobTitlesMultiSelectRef?.current?.resetSelectedValues();
}

// read more at: https://www.npmjs.com/package/multiselect-react-dropdown