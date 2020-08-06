
# Changelog

## Unreleased


## 4.0.3 - 2020/8/6

- change to exp_adoptedStyleSheets

## 4.0.2 - 2020/8/6

- support adoptedStyleSheets ([Trello](https://trello.com/c/cX4q0DzH) [Trello](https://trello.com/c/a22B3tUB))

## 4.0.1 - 2020/7/30

- fix faux shadow DOM
- fix url in css variable

## 4.0.0 - 2020/7/26

- support non-200 resources ([Trello](https://trello.com/c/J5lBWutP))

## 3.7.3 - 2020/7/23

- support src attribute in video tags

## 3.7.2 - 2020/7/22

- avoid removing single `?` from query param in resource urls (mainly to address `?#iefix`, see https://github.com/applitools/mono/issues/79)

## 3.7.1 - 2020/7/16

- fix selected options in select element ([Trello](https://trello.com/c/PftuuFqx))

## 3.7.0 - 2020/7/9

- support resource skip list ([Trello](https://trello.com/c/dz46CZM5/399-dom-snapshot-should-accept-a-skip-list-for-fetched-resources))

## 3.6.2 - 2020/7/7

- fix redirected frames

## 3.6.1 - 2020/7/5

- fix frames that were redirected with JavaScript ([Trello](https://trello.com/c/egprwtNp))

## 3.6.0 - 2020/6/29

- don't fetch google fonts

## 3.5.4 - 2020/6/28

- handle hanging resources ([Trello](https://trello.com/c/iDf2x25p/393-dom-snapshot-fails-to-resource-map-imported-hrefs))

## 3.5.3 - 2020/6/4

- fix dist scripts

## 3.5.2 - 2020/5/6

- fix bug when experimental longhands extracted from the cssom [Trello](https://trello.com/c/ASx8Bwd8/323-difference-in-gradient) [Trello](https://trello.com/c/wOytxwv4/346-ufg-safari-incorrect-render-repeated-image)

## 3.5.0 - 2020/4/30

- added data-applitools-disabled attribute to scripts and fixed disabled attribute for links  

## 3.4.5 - 2020/4/7

- fix missing audio tag src attribute resources

## 3.4.4 - 2020/4/7

- fix missing resources when dealing with fake shadow dom

## 3.4.3 - 2020/4/5

- fix javascript values returned from on<event> attributes

## 3.4.2

- fix shorthand mappings merge

## 3.4.1

- move css-tree from `devDependencies` to `dependencies` for eyes-testcafe
