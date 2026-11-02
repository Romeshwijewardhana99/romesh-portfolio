-- Image URLs are retained; only obsolete provider metadata is removed.
ALTER TABLE `site_settings` DROP COLUMN `profileImagePublicId`;
