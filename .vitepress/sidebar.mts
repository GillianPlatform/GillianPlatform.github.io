import { generateSidebar } from 'vitepress-sidebar';

/** Creates a sidebar using vitepress-sidebar, and performs some transformations on it
 * This includes:
 *  - Remove all children of the 'API reference' item
 *  - Customise expanded/collapsed menus 
 *  - 'Re-pack' the top-level items to emphasise particular groups */

const vitepressSidebarOptions = {
  documentRootPath: '/src',
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: true,
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
  sortMenusByFrontmatterOrder: true,
  frontmatterOrderDefaultValue: Infinity,
  collapsed: true,
};
const expanded = [ "/labs/", "/instantiations/" ];
const mainGroups = [ "/instantiations/" ];
const truncated = [ "/api/" ];

function linkStartsWithAny(item, list) {
  if (!item.link) return false;
  const link = item.link;
  return list.some(s => link.startsWith(s));
}

function transformSidebarItems(items, depth) {
  for (const item of items) {
    if (depth === 0) {
      if (linkStartsWithAny(item, truncated))
        delete item.items;
      if (linkStartsWithAny(item, expanded))
        item.collapsed = false;
    }

    if (item.items)
      transformSidebarItems(item.items, depth+1);
  }
}

function repackSidebar(items) {
  const sidebar = [];
  let acc = [];
  for (const item of items) {
    if (linkStartsWithAny(item, mainGroups)) {
      if (acc.length > 0) {
        sidebar.push({ items: acc });
        acc = [];
      }
      sidebar.push(item);
    } else {
      acc.push(item);
    }
  }
  if (acc.length > 0) {
    sidebar.push({ items: acc });
  }
  return sidebar;
}

const rawSidebar = generateSidebar(vitepressSidebarOptions);
transformSidebarItems(rawSidebar, 0);
const sidebar = repackSidebar(rawSidebar);
export default sidebar;


