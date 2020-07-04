import React, { Component } from 'react'
import SortableTree, { TreeItem } from 'react-sortable-tree'
import 'react-sortable-tree/style.css' // This only needs to be imported once in your app

interface TreeProperty {

}

interface TreeState {
  treeData: TreeItem[]
}

export default class Tree extends Component<TreeProperty, TreeState> {
  constructor(props: Readonly<TreeProperty>) {
    super(props)

    this.state = {
      treeData: [
        { title: 'Chicken', children: [{ title: 'Egg' }] },
        { title: 'Fish', children: [{ title: 'fingerline' }] },
      ],
    }
  }

  canNodeHaveChildren(node: TreeItem): boolean {
    return node.title === 'OR' || node.title === 'AND'
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    )
  }
}
