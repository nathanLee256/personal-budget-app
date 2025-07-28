/* 
	This file is where I am pasting code which has been edited out of my application. 
	It is here should I need it again.
*/

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

/* 	
	START code snippets for the previous dropdownmenu implementation.
 	This implementation required a state array of bools the same length as the userData array. Each bool value in the array
	stored the current value of the isOpen prop of the array of dropdown menus (which represents the state of the dd -open/closed).
	There is also a toggleDropdown() function which can be called to reverse the isOpen value of a specific dropdown (to open or
	close it). Both were defined in the main ImportData component. 
 */

	//array of bools to store the state(open/closed) of each <CustomDropdown> element in the table
	const [dropdownOpen, setDropdownOpen] = useState(
		Array.isArray(userData) && userData.length > 0 ? new Array(userData.length).fill(false) : []
	);

	// runs when user toggles dropdowns - index represents the row of the table. Updates the state array at that index
    const toggleDropdown = (index) => {
		console.log("Toggling dropdown at index:", index);
  
		//the main dropdown needs to close 1- when the user toggles the button they used to open dropdown, and 2-when they click outside it
		setDropdownOpen((prev) =>
		  prev.map((_, i) => i === index ? !prev[i] : false)
		);
		
		if(activeSubmenu){
		  // Close the submenu if the dropwdown is toggled
		  setActiveSubmenu(null);
		};
	  };

	//state array of of strings which were previously being used to display as the text in the Button of the each dropdown
    const [selectedCats, setSelectedCats] = useState(userData && userData.length > 0 ? userData.map(() => "Select") : []);

	function alertFunction() {
		alert("Data successfully saved to database!");
	}

	//handler for the Save Data button at the bottom of page
    const handleDataSubmit = async (e) => {

		alertFunction();
		const url = 'http://localhost:3001/save';
		e.preventDefault();
		try {
		  const payload = userData.map((row, index) => ({
			...row,
			category: selectedCats[index],
			subcategory: selectedCats[index],
		  }));
		  console.log('Payload:', payload);
		  const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		  });
		  if (response.ok) {
			const result = await response.json();
			console.log('Data saved successfully:', result);
		  } else {
			console.error('Server responded with an error:', response.status);
		  }
		} catch (error) {
		  console.error('Error uploading file', error);
		}
	};

/* END code snippets from ImportData */

// example of a file object
const file = {
	name: "receipt.pdf", 
	lastModified: 1719385372000, 
	lastModifiedDate: "Fri Jun 21 2024 10:22:52 GMT+1000 (AEST)", 
	webkitRelativePath: "", 
	size: 23456, 
	type: "application/pdf"
}

/* 
	//terminal output for the process used to merge a completed branch back into master, then delete branch
	Windows PowerShell
	Copyright (C) Microsoft Corporation. All rights reserved.
	Try the new cross-platform PowerShell https://aka.ms/pscore6

	PS C:\Users\natha> cd React
	PS C:\Users\natha\React> cd template
	PS C:\Users\natha\React\template> code .
	PS C:\Users\natha\React\template> git branch
	master
	* userGifts-monthly-refactor
	PS C:\Users\natha\React\template> git checkout master
	>>
	Switched to branch 'master'
	Your branch is up to date with 'origin/master'.
	PS C:\Users\natha\React\template> git merge userGifts-monthly-refactor
	>>
	Updating 648f460..0fc73af
	Fast-forward
	src/pages/GivingTool.js | 182 ++++++++++++++++++++++++++++++------------------
	1 file changed, 113 insertions(+), 69 deletions(-)
	PS C:\Users\natha\React\template> git push origin master
	>>
	Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
	To https://github.com/nathanLee256/personal-budget-app.git
	648f460..0fc73af  master -> master
	PS C:\Users\natha\React\template> git branch
	* master
	userGifts-monthly-refactor
	PS C:\Users\natha\React\template> code .
	PS C:\Users\natha\React\template> git branch -d userGifts-monthly-refactor
	>>
	Deleted branch userGifts-monthly-refactor (was 0fc73af).
	PS C:\Users\natha\React\template> git push origin --delete userGifts-monthly-refactor
	>>
	To https://github.com/nathanLee256/personal-budget-app.git
	- [deleted]         userGifts-monthly-refactor
	PS C:\Users\natha\React\template> 
*/
