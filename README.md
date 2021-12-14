<!-- Preview Shortcut [Ctrl+K V] [Ctrl+Shift+V] -->

#### Staging a folder `git add .\components\PO\POdetail\/*`

# App Hierarchy

- Procurement
  - PO
    - [refId]
  - MWO
- Inventory

# Pages Hierarchy

## PO Page

- List of POs
  - `POentry` (list-map)
- New PO Form
  - `Modal`
  - `MultiForm`

## [refId] Page

- `Portal`
  - `Modal`
  - `MultiForm` (update items)
- `POheader`
- `POnavList`
- `POitemDetail`

# Components Hierarchy

## `POentry`

- #### `POentryBar`
  This starts here

## POheader

- #### Overview Section
- #### Meta Section
- #### Controls Section

## POnavList

- #### Item List (Map of items)
  - #### Version List (Map of versions)
      <!-- - ### Overview Section
    <!-- - ### Meta Section -->
    <!-- - ### Controls Section -->

## POitemDetail
