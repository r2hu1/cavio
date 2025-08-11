import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { count, eq } from "drizzle-orm";

export const premiumRouter = createTRPCRouter({
	getProducts: protectedProcedure.query(async () => {
		const products = await polarClient.products.list({
			isArchived: false,
			isRecurring: true,
			sorting: ["price_amount"],
		});
		return products.result.items;
	}),
	getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
		const products = await polarClient.customers.getStateExternal({
			externalId: ctx.auth.user.id,
		});
		const subscriptions = products.activeSubscriptions[0];
		if (!subscriptions) {
			return null;
		}
		const product = await polarClient.products.get({
			id: subscriptions.productId,
		});
		return product;
	}),
	getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
		const customer = await polarClient.customers.getStateExternal({
			externalId: ctx.auth.user.id,
		});
		const subscriptions = customer.activeSubscriptions[0];
		if (!subscriptions) return false;
		return {
			...subscriptions,
		};
	}),
	getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
		const customer = await polarClient.customers.getStateExternal({
			externalId: ctx.auth.user.id,
		});
		const subscriptions = customer.activeSubscriptions[0];
		if (subscriptions) return null;

		const [userDocuments] = await db
			.select({
				count: count(documents.id),
			})
			.from(documents)
			.where(eq(documents.userId, ctx.auth.user.id));

		const [userFolders] = await db
			.select({
				count: count(folders.id),
			})
			.from(folders)
			.where(eq(folders.userId, ctx.auth.user.id));

		return {
			documentsCount: userDocuments.count,
			foldersCount: userFolders.count,
		};
	}),
});
