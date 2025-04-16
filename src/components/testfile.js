{/* JSX which Renders the portal submenu if activeSubmenu is set */}
{activeSubmenu && dropdownOpen[activeSubmenu.index] && (
	console.log("Rendering PortalSubmenu"), 
	<PortalSubmenu
	  onClick={() => console.log("PortalSubmenu clicked")}
	  style={{
		position: "absolute", // positions the submenu exactly using top/left values (removes it from normal document flow)
		top: activeSubmenu.top, // sets the vertical position of the submenu relative to the page
		left: activeSubmenu.left, // sets the horizontal position of the submenu relative to the page
		zIndex: 9999, // ensures the submenu appears on top of other overlapping elements
		background: "#fff", // specifies the background colour
		border: "1px solid black", // specifies the border
		borderRadius: "0.375rem", // applies the same border-radius style as the reactstrap main dropdownmenu
		width: "250px", // specifies the width of the submenu
		pointerEvents: "auto", // ensures submenu can receive clicks
		overflow: "hidden", // ensures no child content "spills" outside the rounded border (interfering with rounded corners)
	  }}
	>
	  <StyledSubmenuDiv> 
		{/* map over budgetItems-display each item for each tertCat as a dropdownitem in the submenu */}
		{activeSubmenu.type === "Income" &&
		  budgetItems.Income[activeSubmenu.secondary][activeSubmenu.tertiary].map((item, index) => { 
			console.log("Rendering DropdownItem for:", item);
			return(
			  <StyledRows index={index}> 
				<StyledSubDDItem
				  key={index} 
				  onMouseDown={() => handleItemSelect(activeSubmenu, item)} // ✅ Pass the actual item
				>
				  {item.item}
				</StyledSubDDItem>
			  </StyledRows>
			);
		  })}
		  
		{activeSubmenu.type === "Expenditure" &&
		  budgetItems.Expenditure[activeSubmenu.secondary][activeSubmenu.tertiary].map((item, index) => { 
			console.log("Rendering DropdownItem for:", item);
			return(
			  <StyledRows index={index}> 
				<StyledSubDDItem 
				  key={index} 
				  onMouseDown={() => handleItemSelect(activeSubmenu, item)} // ✅ Pass the actual item
				>
				  {item.item}
				</StyledSubDDItem>
			  </StyledRows>
			);
		  })}
		  <StyledDivider/>
		  {/* Single 'Add Item' button per submenu */}
		  <StyledAddItemButton
			color="primary"
			onPointerDown={(e) => {

			  //store submenu and dd state in cache
			  cachedSubmenuRef.current = activeSubmenu;
			  cachedDropdownIndexRef.current = activeSubmenu.index;

			  //1-manually reopen dropdown and submenu using cached state values
			  //2-then update addItem state

			  setTimeout(() => {
				//1
				//read submenu and dropdown state in cache (after caching)
				const cachedSubmenu = cachedSubmenuRef.current;
				const cachedDDIndex = cachedDropdownIndexRef.current;

				console.log("Restoring submenu:", cachedSubmenu);

				if (cachedSubmenu && cachedDDIndex !== null){
				  setDropdownOpen((current) => {
					const updatedArray = current.map((dd, index) => index === cachedDDIndex ? true : false);
					return updatedArray;
				  });
				  setActiveSubmenu(cachedSubmenu);
				};
				//2
				setAddBItem(true);
			  } , 100);
			}}
		  >
			Add New Budget Item
		  </StyledAddItemButton>
		  {/* Add Tax item Button */}
		  <StyledAddItemButton
			color="warning"
			onPointerDown={(e) => {

			  //store submenu and dd state in cache
			  cachedSubmenuRef.current = activeSubmenu;
			  cachedDropdownIndexRef.current = activeSubmenu.index;

			  //1-manually reopen dropdown and submenu using cached state values
			  //2-then update addItem state

			  setTimeout(() => {
				
				  //1
				  //read submenu and dropdown state in cache (after caching)
				  const cachedSubmenu = cachedSubmenuRef.current;
				  const cachedDDIndex = cachedDropdownIndexRef.current;

				  console.log("Restoring submenu:", cachedSubmenu);

				  if (cachedSubmenu && cachedDDIndex !== null){
					setDropdownOpen((current) => {
					  const updatedArray = current.map((dd, index) => index === cachedDDIndex ? true : false);
					  return updatedArray;
					});
					setActiveSubmenu(cachedSubmenu);
				  };

				  //2
				  setAddTItem(true);
				} , 
			  100);
			}}
		  >
			Add to Tax Items
		  </StyledAddItemButton>
		  { addBItem || addTItem && (
			<>
			</>

		  )}
			<StyledSubDDItem key="add-item">
			  {/* Conditionally Render Form */}
			  { 
				addBItem || addTItem && (
				  <AddItemForm
					toggle={toggle}
					newItem={newItem}
					setNewItem={setNewItem}
					addBItem={addBItem}
					addTItem={addTItem}
					cachedSubmenuRef={cachedSubmenuRef}
					cachedDropdownIndexRef={cachedDropdownIndexRef}
					activeSubmenu={activeSubmenu}
				  />
			  )}
			</StyledSubDDItem>
	  </StyledSubmenuDiv>
	</PortalSubmenu>
  )}
