import React, { ChangeEventHandler, Component } from 'react'
import SortableTree, { changeNodeAtPath, TreeItem } from 'react-sortable-tree'
import 'react-sortable-tree/style.css'

import { isAndNode, isOrNode, parse, QueryNode } from 'gmail-filter-query-parser-test'
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils'

interface TreeProperty {

}

interface TreeState {
  treeData: TreeItem[]
  textInput: string
}

const transformQueryNodeToTreeItem = (queryNode: QueryNode): TreeItem => {
  if (isOrNode(queryNode)) {
    return {
      title: 'OR',
      children: queryNode.$or.map(transformQueryNodeToTreeItem),
      expanded: true,
    }
  }

  if (isAndNode(queryNode)) {
    return {
      title: 'AND',
      children: queryNode.$and.map(transformQueryNodeToTreeItem),
      expanded: true,
    }
  }

  return {
    title: queryNode.value,
  }
}

export default class Tree extends Component<TreeProperty, TreeState> {
  constructor(props: Readonly<TreeProperty>) {
    super(props)

    this.state = {
      treeData: [],
      textInput: '((from:(account@strata1.com) AND has:attachment) OR (from:(account@strata2.com) AND has:attachment) OR ((from:(noreply@strata3.com) OR from:(account@strata3.com)) AND subject:(Levy) AND has:attachment) OR (from:(noreply@internet.co) AND subject:(Invoice)) OR (from:(donotreply@reates.govt) AND has:attachment))',
    }

    this.handleTextInputChange = this.handleTextInputChange.bind(this)
    this.parseTextInput = this.parseTextInput.bind(this)
  }

  handleTextInputChange(event: Parameters<ChangeEventHandler<{ value: TreeState['textInput'] }>>[0]) {
    const value = event.target.value
    this.setState({
      textInput: value,
    })
  }

  parseTextInput() {
    try {
      const parsed = parse(this.state.textInput)
      this.setState({
        treeData: [transformQueryNodeToTreeItem(parsed)],
      })
    } catch (error) {
      console.error(error)
    }
  }

  canNodeHaveChildren(node: TreeItem): boolean {
    return node.title === 'OR' || node.title === 'AND'
  }

  render() {
    const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex
    return (
      <div style={{ height: 800 }}>
        <textarea style={{width: '100%', height: 100}} value={this.state.textInput} onChange={this.handleTextInputChange}/>
        <button style={{width: '100%'}} onClick={this.parseTextInput}>Parse</button>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          canNodeHaveChildren={this.canNodeHaveChildren}
          generateNodeProps={({ node, path }) => ({
            title: (
              <input
                style={{ fontSize: '1.1rem', width: 400 }}
                value={node.title as string}
                onChange={event => {
                  const title = event.target.value

                  this.setState(state => ({
                    treeData: changeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                      newNode: { ...node, title },
                    }),
                  }))
                }}
              />
            ),
          })}
        />
      </div>
    )
  }
}
