package tree_sitter_iec61131_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_iec61131 "github.com/heytalepazguato/tree-sitter-iec61131-st/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_iec61131.Language())
	if language == nil {
		t.Errorf("Error loading Iec61131 grammar")
	}
}
