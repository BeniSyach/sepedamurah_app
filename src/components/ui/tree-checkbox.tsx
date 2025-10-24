'use client'

import { useState } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { type TreeNode } from '@/components/layout/menu-tree-helper'

type MenuTreeProps = {
  nodes: TreeNode[]
  checked: string[]
  onCheck: (checked: string[]) => void
}

export function MenuTree({ nodes, checked, onCheck }: MenuTreeProps) {
  return (
    <ul className='space-y-1'>
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.value}
          node={node}
          checked={checked}
          onCheck={onCheck}
        />
      ))}
    </ul>
  )
}

function TreeNodeItem({
  node,
  checked,
  onCheck,
}: {
  node: TreeNode
  checked: string[]
  onCheck: (checked: string[]) => void
}) {
  const [open, setOpen] = useState(true)
  const hasChildren = (node.children?.length ?? 0) > 0
  const isChecked = checked.includes(node.value)

  const toggleCheck = () => {
    if (isChecked) {
      onCheck(checked.filter((c) => c !== node.value))
    } else {
      onCheck([...checked, node.value])
    }
  }

  return (
    <li>
      <div className='flex items-center space-x-1'>
        {hasChildren ? (
          <button
            type='button'
            className='flex h-4 w-4 items-center justify-center'
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className='h-4 w-4' />
        )}
        <label className='flex cursor-pointer items-center space-x-2'>
          <input type='checkbox' checked={isChecked} onChange={toggleCheck} />
          <span>{node.label}</span>
        </label>
      </div>

      {hasChildren && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Content>
            <div className='mt-1 pl-5'>
              <MenuTree
                nodes={node.children ?? []}
                checked={checked}
                onCheck={onCheck}
              />
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </li>
  )
}
