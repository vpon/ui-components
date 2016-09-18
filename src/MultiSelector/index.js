import React, { PropTypes } from 'react';
import AllList from './AllList';
import SelectedList from './SelectedList';

const MultiSelector = (props) => {
  return (
    <div className="row-gapless">
      <AllList
        title={props.allListTitle}
        selectable={props.selectable}
        searchBoxPlaceholder={props.searchBoxPlaceholder}
        inheritable={props.inheritable}
        listingItems={props.listingItems}
        selectedItems={props.selectedItems}
        allItems={props.allItems}
        inheritedItems={props.inheritedItems}
        dataTableProps={props.dataTableProps}
        onChange={props.onChange}
      />
      <SelectedList
        title={props.selectedListTitle}
        removeAllLabel={props.removeAllLabel}
        inheritable={props.inheritable}
        selectedItems={props.selectedItems}
        inheritedItems={props.inheritedItems}
        onChange={props.onChange}
        inheritText={props.inheritText}
      />
    </div>
  );
}

MultiSelector.propTypes = {
  // All list props
  allListTitle: PropTypes.string.isRequired,
  selectable: PropTypes.bool,
  searchBoxPlaceholder: PropTypes.string.isRequired,
  listingItems: PropTypes.array.isRequired,
  allItems: PropTypes.array.isRequired,
  dataTableProps: PropTypes.shape({
    onQueryChange: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    total: PropTypes.total,
    query: PropTypes.object.isRequired
  }),
  // Selected list props
  selectedListTitle: PropTypes.string.isRequired,
  removeAllLabel: PropTypes.string.isRequired,
  // Common props
  inheritable: PropTypes.bool,
  selectedItems: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  inheritedItems: PropTypes.array,
  inheritText: PropTypes.string
};

MultiSelector.defaultProps = {
  selectable: true,
  inheritable: false
};

export default MultiSelector;
