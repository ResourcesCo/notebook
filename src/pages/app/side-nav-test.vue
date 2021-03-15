<template>
  <Nav>
    <TabArea>
      <Tab :selected="true">👁 Preview</Tab>
    </TabArea>
    <DisplayMenu />
  </Nav>
  <main class="m-1">
    <div>This is another page!</div>
    <div>It navigated independently.</div>
  </main>
</template>