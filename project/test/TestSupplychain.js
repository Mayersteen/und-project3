// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // Tests for basis functionality to avoid downstream errors in required tests
    it("Testing farmer role assignment and revocation", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addFarmer(originFarmerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_add, "FarmerAdded");
        assert.equal(await supplyChain.isFarmer(originFarmerID, {from: ownerID}), true, "FarmerRole was assigned")

        let tx_renounce = await supplyChain.renounceFarmer({from: originFarmerID})
        truffleAssert.eventEmitted(tx_renounce, "FarmerRemoved");
        assert.equal(await supplyChain.isFarmer(originFarmerID), false, "FarmerRole was removed")
    })

    it("Testing distributor role assignment and revocation", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addDistributor(distributorID, {from: ownerID})
        truffleAssert.eventEmitted(tx_add, "DistributorAdded");
        assert.equal(await supplyChain.isDistributor(distributorID, {from: ownerID}), true, "DistributorRole was assigned")

        let tx_renounce = await supplyChain.renounceDistributor({from: distributorID})
        truffleAssert.eventEmitted(tx_renounce, "DistributorRemoved");
        assert.equal(await supplyChain.isDistributor(distributorID), false, "DistributorRole was removed")
    })

    it("Testing retailer role assignment and revocation", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addRetailer(retailerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_add, "RetailerAdded");
        assert.equal(await supplyChain.isRetailer(retailerID, {from: ownerID}), true, "RetailerRole was assigned")

        let tx_renounce = await supplyChain.renounceRetailer({from: retailerID})
        truffleAssert.eventEmitted(tx_renounce, "RetailerRemoved");
        assert.equal(await supplyChain.isRetailer(retailerID), false, "RetailerRole was removed")
    })

    it("Testing consumer role assignment and revocation", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addConsumer(consumerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_add, "ConsumerAdded");
        assert.equal(await supplyChain.isConsumer(consumerID, {from: ownerID}), true, "ConsumerRole was assigned")

        let tx_renounce = await supplyChain.renounceConsumer({from: consumerID})
        truffleAssert.eventEmitted(tx_renounce, "ConsumerRemoved");
        assert.equal(await supplyChain.isConsumer(consumerID), false, "ConsumerRole was removed")
    })

    // Ensure that the roles are set for the downstream tests
    it("Add roles for downstream tests", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_addf = await supplyChain.addFarmer(originFarmerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_addf, "FarmerAdded");
        assert.equal(await supplyChain.isFarmer(originFarmerID, {from: ownerID}), true, "FarmerRole was assigned")

        let tx_addd = await supplyChain.addDistributor(distributorID, {from: ownerID})
        truffleAssert.eventEmitted(tx_addd, "DistributorAdded");
        assert.equal(await supplyChain.isDistributor(distributorID, {from: ownerID}), true, "DistributorRole was assigned")

        let tx_addr = await supplyChain.addRetailer(retailerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_addr, "RetailerAdded");
        assert.equal(await supplyChain.isRetailer(retailerID, {from: ownerID}), true, "RetailerRole was assigned")

        let tx_addc = await supplyChain.addConsumer(consumerID, {from: ownerID})
        truffleAssert.eventEmitted(tx_addc, "ConsumerAdded");
        assert.equal(await supplyChain.isConsumer(consumerID, {from: ownerID}), true, "ConsumerRole was assigned")
    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as Harvested by calling function harvestItem()
        let tx = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, {from: originFarmerID})

        // Verify the emitted event
        truffleAssert.eventEmitted(tx, 'Harvested')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')

    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event and call processItem()
        let tx = await supplyChain.processItem(upc, {from: originFarmerID})
        truffleAssert.eventEmitted(tx, 'Processed')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call packItem()
        let tx = await supplyChain.packItem(upc, {from: originFarmerID})
        truffleAssert.eventEmitted(tx, 'Packed')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call sellItem()
        let tx = await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})
        truffleAssert.eventEmitted(tx, 'ForSale')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')

    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call buyItem()
        let tx = await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
        truffleAssert.eventEmitted(tx, 'Sold')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID');
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call buyItem()
        let tx = await supplyChain.shipItem(upc, {from: distributorID})
        truffleAssert.eventEmitted(tx, 'Shipped')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID');
              
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call buyItem()
        let tx = await supplyChain.receiveItem(upc, {from: retailerID})
        truffleAssert.eventEmitted(tx, 'Received')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID');

    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event and call buyItem()
        let tx = await supplyChain.purchaseItem(upc, {from: consumerID})
        truffleAssert.eventEmitted(tx, 'Purchased')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product note')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID');

        
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne_farmer = await supplyChain.fetchItemBufferOne.call(upc, {from: originFarmerID})
        const resultBufferOne_distributor = await supplyChain.fetchItemBufferOne.call(upc, {from: distributorID})
        const resultBufferOne_retailer = await supplyChain.fetchItemBufferOne.call(upc, {from: retailerID})
        const resultBufferOne_consumer = await supplyChain.fetchItemBufferOne.call(upc,{from: consumerID})

        // Verify the result set:
        //   As the function was used in several of the prior tests, I only focus on the basic accessibility from
        //   different roles and avoid checking all the values.
        assert.equal(resultBufferOne_farmer[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne_distributor[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne_retailer[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne_consumer[0], sku, 'Error: Invalid item SKU')

    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo_farmer = await supplyChain.fetchItemBufferOne.call(upc, {from: originFarmerID})
        const resultBufferTwo_distributor = await supplyChain.fetchItemBufferOne.call(upc, {from: distributorID})
        const resultBufferTwo_retailer = await supplyChain.fetchItemBufferOne.call(upc, {from: retailerID})
        const resultBufferTwo_consumer = await supplyChain.fetchItemBufferOne.call(upc,{from: consumerID})

        // Verify the result set:
        //   As the function was used in several of the prior tests, I only focus on the basic accessibility from
        //   different roles and avoid checking all the values.
        assert.equal(resultBufferTwo_farmer[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo_distributor[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo_retailer[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo_consumer[0], sku, 'Error: Invalid item SKU')
        
    })

});

