document.addEventListener("DOMContentLoaded", function () {
  const customSelects = document.querySelectorAll(".custom-select");

  function updateSelectedDropdownMultiselectOptions(customSelect) {
    const selectedOptions = Array.from(
      customSelect.querySelectorAll(".option.active")
    )
      .filter(
        (option) => option !== customSelect.querySelector(".option.all-tags")
      )
      .map(function (option) {
        return {
          value: option.getAttribute("data-value"),
          text: option.textContent.trim(),
        };
      });

    const selectedValues = selectedOptions.map(function (option) {
      return option.value;
    });

    customSelect.querySelector(".tags_input").value = selectedValues.join(", ");
    console.log("options selected: ", selectedOptions.value);

    let tagsHTML = "";

    if (selectedOptions.length === 0) {
      tagsHTML = '<span class="placeholder"> Select Columns</span>';
    } else {
      const maxTagsToShow = 4;
      let additionalTagCount = 0;

      selectedOptions.forEach(function (option, index) {
        if (index < maxTagsToShow) {
          tagsHTML +=
            '<span class="tag">' +
            option.text +
            '<span class="removed-tag" data-value="' +
            option.value +
            '"><i class="bx bx-x bx-sm"></i></span></span>';
        } else {
          additionalTagCount++;
        }
      });

      if (additionalTagCount > 0) {
        tagsHTML += '<span class="tag">+' + additionalTagCount + "</span>";
      }
    }

    customSelect.querySelector(".selected-options").innerHTML = tagsHTML;
  }

  //Search input options logic
  customSelects.forEach(function (customSelect) {
    const searchInputMultiselectDropdown =
      customSelect.querySelector(".search-tags");
    const optionsContainer = customSelect.querySelector(".options");
    const noResultsMessage = customSelect.querySelector(
      ".no-result-multiselect-dropdown"
    );
    const options = customSelect.querySelectorAll(".option");
    const selectAllOption = customSelect.querySelector(".option.all-tags");
    const clearOptionsSelected = customSelect.querySelector(".clear-options");

    selectAllOption.addEventListener("click", function () {
      const isActive = selectAllOption.classList.contains("active");

      options.forEach(function (option) {
        // if (option.classList.contains("active")) {
        //   var checkIcon = option.querySelector("i");
        //   checkIcon.className = "bx bxs-check-square bx-sm";
        //   checkIcon.style.color = "#0275f9";
        // } else {
        // }

        if (option !== selectAllOption) {
          option.classList.toggle("active", !isActive);
        }
      });

      updateSelectedDropdownMultiselectOptions(customSelect);
    });

    //CLear Options
    clearOptionsSelected.addEventListener("click", function () {
      searchInputMultiselectDropdown.value = "";
      resetCustomSelects();
      options.forEach(function (option) {
        option.style.display = "flex";
      });
      noResultsMessage.style.display = "none";
    });

    //Search option input
    searchInputMultiselectDropdown.addEventListener("input", function () {
      const searchTerm = searchInputMultiselectDropdown.value.toLowerCase();
      options.forEach(function (option) {
        const optionText = option.textContent.trim().toLowerCase();
        const showOptionMatch = optionText.includes(searchTerm);
        option.style.display = showOptionMatch ? "flex" : "none";
      });

      const anyOptionsMatch = Array.from(options).some(
        (option) => option.style.display === "block"
      );
      noResultsMessage.style.display = anyOptionsMatch ? "none" : "flex";

      if (searchTerm) {
        optionsContainer.classList.add("option-search-active");
      } else {
        optionsContainer.classList.remove("option-search-active");
      }
    });
  });

  //Collapse/Expand dropdown
  customSelects.forEach(function (customSelect) {
    const options = customSelect.querySelectorAll(".option");
    options.forEach(function (option) {
      option.addEventListener("click", function () {
        option.classList.toggle("active");
        if (option.classList.contains("active")) {
          var icon = option.querySelector("i");
          icon.className = "bx bxs-check-square bx-sm";
          icon.style.color = "#0275f9";
        } else {
          var icon = option.querySelector("i");
          icon.className = "bx bx-checkbox bx-sm";
          icon.style.color = "";
        }

        updateSelectedDropdownMultiselectOptions(customSelect);
      });
    });
  });

  //Remove selected options tags
  document.addEventListener("click", function (event) {
    const removeOptionSelectedTag = event.target.closest(".removed-tag");
    if (removeOptionSelectedTag) {
      const customSelect = removeOptionSelectedTag.closest(".custom-select");
      const valueToRemove = removeOptionSelectedTag.getAttribute("data-value");
      const optionToRemove = customSelect.querySelector(
        ".option[data-value='" + valueToRemove + "']"
      );
      optionToRemove.classList.remove("active");

      const otherSelectedOptions = customSelect.querySelectorAll(
        ".option.active:not(.all-tags)"
      );
      const allTagsOptions = customSelect.querySelector(".option.all-tags");

      if (otherSelectedOptions.length === 0) {
        allTagsOptions.classList.remove("active");
      }
      updateSelectedDropdownMultiselectOptions(customSelect);
    }
  });

  const selectBoxes = document.querySelectorAll(".select-box");
  selectBoxes.forEach(function (selectBoxes) {
    selectBoxes.addEventListener("click", function (event) {
      selectBoxes.parentNode.classList.toggle("open");
    });
  });

  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".custom-select") &&
      !event.target.classList.contains("removed-tag")
    ) {
      customSelects.forEach(function (customSelect) {
        customSelect.classList.remove("open");
      });
    }
  });

  function resetCustomSelects() {
    customSelects.forEach(function (customSelect) {
      customSelect
        .querySelectorAll(".option.active")
        .forEach(function (option) {
          option.classList.remove("active");
        });
      customSelect.querySelector(".option.all-tags").classList.remove("active");
      updateSelectedDropdownMultiselectOptions(customSelect);
    });
  }
  updateSelectedDropdownMultiselectOptions(customSelects[0]);

  const submitButton = document.querySelector(".btn_submit");
  submitButton.addEventListener("click", function () {
    let valid = true;

    customSelects.forEach(function (customSelect) {
      const selectedOptions = customSelect.querySelectorAll(".option.active");

      if (selectedOptions.length === 0) {
        const tagErrorMsg = customSelect.querySelector(
          ".result-multiselect-dropdown"
        );
        tagErrorMsg.textContent = "This field is required";
        tagErrorMsg.style.display = "block";
        valid = false;
      } else {
        const tagErrorMsg = customSelect.querySelector(
          ".result-multiselect-dropdown"
        );
        tagErrorMsg.textContent = "";
        tagErrorMsg.style.display = "none";
      }
    });

    if (valid) {
      let tags = document.querySelector(".tags_input").value;
      alert(tags);
      resetCustomSelects();
      return;
    }
  });
});
