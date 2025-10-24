// menu-tree-helper.ts
import { sidebarData } from './data/sidebar-data'

export type TreeNode = {
  value: string
  label: string
  children?: TreeNode[]
}

export function buildMenuTree(): TreeNode[] {
  return sidebarData.navGroups.map((group) => ({
    value: group.id,
    label: group.title,
    children: group.items ? group.items.map(mapItemToTreeNode) : [], // <-- pakai [] jika tidak ada items
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItemToTreeNode(item: any): TreeNode {
  return {
    value: item.id,
    label: item.title,
    children: item.items ? item.items.map(mapItemToTreeNode) : [], // <--- pastikan array, bukan undefined
  }
}
